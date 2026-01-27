# Cesium 지도 가이드

Cesium 3D 지도를 프로젝트에 통합하고 사용하는 방법을 설명합니다.

## 개요

Cesium은 3D 지구 및 지도 시각화를 위한 오픈소스 JavaScript 라이브러리입니다. 이 프로젝트에서는 Cesium을 전역 인프라로 구성하여 여러 컴포넌트에서 공유 사용할 수 있도록 구현했습니다.

**주요 특징:**

- Redux 기반 상태 관리
- 전역 Viewer 인스턴스 공유
- 재사용 가능한 UI 컴포넌트
- 유틸리티 함수 제공

## 프로젝트 구조

```
src/globals/cesium/
├── ui/
│   ├── MapViewer.tsx      # Viewer UI 컴포넌트
│   └── MapControls.tsx     # 컨트롤 컴포넌트
├── cesiumTypes.ts         # 타입 정의
├── cesiumConfig.ts        # 설정
├── cesiumReducer.ts       # Redux slice
├── cesiumUtils.ts         # 유틸 함수
└── index.ts               # 통합 export
```

## 설치 및 설정

### 1. 패키지 설치

Cesium 패키지는 이미 설치되어 있습니다:

```json
{
    "dependencies": {
        "cesium": "^1.137.0"
    },
    "devDependencies": {
        "vite-plugin-static-copy": "^3.1.5"
    }
}
```

### 2. Vite 설정

`vite.config.ts`에 Cesium 설정이 포함되어 있습니다:

```typescript
import { viteStaticCopy } from 'vite-plugin-static-copy'

const cesiumSource = 'node_modules/cesium/Build/Cesium'
const cesiumBaseUrl = 'cesiumStatic'

export default defineConfig({
    plugins: [
        // ... 다른 플러그인들
        cesiumStaticPlugin(), // 개발 서버용 정적 파일 서빙
        viteStaticCopy({
            targets: [
                { src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
                { src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
                { src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
                { src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl },
            ],
        }),
    ],
    define: {
        CESIUM_BASE_URL: JSON.stringify(cesiumBaseUrl),
    },
})
```

### 3. Redux Store 설정

`reduxStore.tsx`에 cesiumReducer가 등록되어 있습니다:

```typescript
import { cesiumSaga, cesiumSlice } from 'src/globals/cesium/cesiumReducer'

const reducers = {
    // ... 다른 reducer들
    cesiumReducer: cesiumSlice.reducer,
}

export function* rootSaga() {
    yield all([, /* ... */ cesiumSaga()])
}
```

## 사용법

### 기본 사용

가장 간단한 방법은 `MapViewer` 컴포넌트를 사용하는 것입니다:

```tsx
import { MapViewer } from 'src/globals/cesium/ui/MapViewer'
import { MapControls } from 'src/globals/cesium/ui/MapControls'

function MyComponent() {
    return (
        <div>
            <MapControls />
            <MapViewer height="600px" />
        </div>
    )
}
```

### MapViewer Props

```typescript
interface MapViewerProps {
    className?: string // 추가 CSS 클래스
    height?: string // 지도 높이 (기본: '600px')
    options?: Partial<ViewerOptions> // Cesium Viewer 옵션
    onViewerReady?: (viewer: Viewer) => void // Viewer 준비 완료 콜백
}
```

### Redux State 접근

Viewer 인스턴스는 Redux state에서 관리됩니다:

```tsx
import { useAppSelector } from 'src/globals/store/redux/reduxHooks'

function MyComponent() {
    const { viewer, isLoading, error, isInitialized } = useAppSelector(
        (state) => state.cesiumReducer,
    )

    if (isLoading) return <div>로딩 중...</div>
    if (error) return <div>오류: {error}</div>
    if (!isInitialized) return <div>초기화되지 않음</div>

    // viewer 사용
    return <div>Viewer 준비됨</div>
}
```

### Redux Actions 사용

```tsx
import { useAppDispatch } from 'src/globals/store/redux/reduxHooks'
import { cesiumAction } from 'src/globals/cesium/cesiumReducer'

function MyComponent() {
    const dispatch = useAppDispatch()

    const handleReset = () => {
        dispatch(cesiumAction.reset())
    }

    const handleSetError = (message: string) => {
        dispatch(cesiumAction.setError(message))
    }

    return (
        <div>
            <button onClick={handleReset}>리셋</button>
        </div>
    )
}
```

## 유틸리티 함수

`cesiumUtils.ts`에서 제공하는 유틸리티 함수들:

### 카메라 제어

```tsx
import { flyTo, setView } from 'src/globals/cesium/cesiumUtils'
import { useAppSelector } from 'src/globals/store/redux/reduxHooks'

function MyComponent() {
    const viewer = useAppSelector((state) => state.cesiumReducer.viewer)

    const handleFlyToSeoul = () => {
        // 애니메이션과 함께 이동 (경도, 위도, 높이, 지속시간)
        flyTo(viewer, 126.978, 37.5665, 10000, 2.0)
    }

    const handleJumpToTokyo = () => {
        // 즉시 이동
        setView(viewer, 139.6917, 35.6895, 10000)
    }

    return (
        <div>
            <button onClick={handleFlyToSeoul}>서울로 이동</button>
            <button onClick={handleJumpToTokyo}>도쿄로 이동</button>
        </div>
    )
}
```

### 엔티티 관리

```tsx
import {
    addEntity,
    removeEntity,
    removeAllEntities,
} from 'src/globals/cesium/cesiumUtils'
import { useAppSelector } from 'src/globals/store/redux/reduxHooks'

function MyComponent() {
    const viewer = useAppSelector((state) => state.cesiumReducer.viewer)

    const handleAddMarker = () => {
        addEntity(viewer, 'marker-1', {
            position: { longitude: 126.978, latitude: 37.5665, height: 0 },
            point: {
                pixelSize: 15,
                color: '#FF0000',
            },
            label: {
                text: '서울',
                font: '14px sans-serif',
                fillColor: '#FFFFFF',
            },
        })
    }

    const handleRemoveMarker = () => {
        removeEntity(viewer, 'marker-1')
    }

    const handleClearAll = () => {
        removeAllEntities(viewer)
    }

    return (
        <div>
            <button onClick={handleAddMarker}>마커 추가</button>
            <button onClick={handleRemoveMarker}>마커 제거</button>
            <button onClick={handleClearAll}>전체 제거</button>
        </div>
    )
}
```

### Viewer 유효성 검사

```tsx
import {
    isValidViewer,
    safeDestroyViewer,
} from 'src/globals/cesium/cesiumUtils'

function MyComponent() {
    const viewer = useAppSelector((state) => state.cesiumReducer.viewer)

    const handleCheck = () => {
        if (isValidViewer(viewer)) {
            console.log('Viewer가 유효합니다')
        } else {
            console.log('Viewer가 유효하지 않습니다')
        }
    }

    const handleDestroy = () => {
        safeDestroyViewer(viewer)
    }

    return (
        <div>
            <button onClick={handleCheck}>유효성 검사</button>
            <button onClick={handleDestroy}>Viewer 파괴</button>
        </div>
    )
}
```

## 설정 커스터마이징

### 기본 Viewer 옵션 변경

`cesiumConfig.ts`에서 기본 옵션을 수정할 수 있습니다:

```typescript
export const cesiumConfig = {
    baseUrl: CESIUM_BASE_URL,
    defaultViewerOptions: {
        terrainProvider: undefined,
        animation: true,
        timeline: true,
        fullscreenButton: true,
        // ... 기타 옵션
    } as const,
} as const
```

### 컴포넌트에서 옵션 오버라이드

```tsx
import { MapViewer } from 'src/globals/cesium/ui/MapViewer'

function MyComponent() {
    return (
        <MapViewer
            height="800px"
            options={{
                animation: false,
                timeline: false,
                geocoder: false,
            }}
        />
    )
}
```

## Redux State 구조

```typescript
interface CesiumState {
    viewer: CesiumViewer | null // Viewer 인스턴스
    isInitialized: boolean // 초기화 여부
    isLoading: boolean // 로딩 상태
    error: string | null // 에러 메시지
}
```

## 타입 정의

주요 타입들은 `cesiumTypes.ts`에서 정의되어 있습니다:

```typescript
export type CesiumViewer = Viewer

export interface CesiumViewerOptions extends ViewerOptions {
    container: HTMLElement
}

export interface CesiumState {
    viewer: CesiumViewer | null
    isInitialized: boolean
    isLoading: boolean
    error: string | null
}
```

## 예제

### 기본 지도 표시

```tsx
import { MapViewer, MapControls } from 'src/globals/cesium'

function HomePage() {
    return (
        <div className="p-4">
            <h1>Cesium 지도</h1>
            <MapControls className="mb-4" />
            <MapViewer height="600px" />
        </div>
    )
}
```

### Viewer 인스턴스 직접 사용

```tsx
import { useEffect } from 'react'
import { useAppSelector } from 'src/globals/store/redux/reduxHooks'
import { addEntity } from 'src/globals/cesium/cesiumUtils'

function MyComponent() {
    const viewer = useAppSelector((state) => state.cesiumReducer.viewer)

    useEffect(() => {
        if (viewer) {
            // Viewer가 준비되면 마커 추가
            addEntity(viewer, 'my-marker', {
                position: { longitude: 126.978, latitude: 37.5665 },
                point: { pixelSize: 20, color: '#00FF00' },
                label: { text: '내 위치' },
            })
        }
    }, [viewer])

    return <div>마커가 추가되었습니다</div>
}
```

### 커스텀 컨트롤

```tsx
import { useCallback } from 'react'
import { useAppSelector } from 'src/globals/store/redux/reduxHooks'
import { flyTo } from 'src/globals/cesium/cesiumUtils'

function CustomControls() {
    const viewer = useAppSelector((state) => state.cesiumReducer.viewer)

    const handleCustomAction = useCallback(() => {
        if (viewer) {
            // 특정 위치로 이동
            flyTo(viewer, 127.5, 37.5, 5000, 3.0)
        }
    }, [viewer])

    return <button onClick={handleCustomAction}>커스텀 위치로 이동</button>
}
```

## 주의사항

1. **Viewer 인스턴스 공유**: 여러 컴포넌트에서 동일한 Viewer 인스턴스를 공유하므로, 한 곳에서 파괴하면 다른 곳에서도 영향을 받습니다.

2. **Redux State 관리**: Viewer 인스턴스는 Redux state에 저장되지만, 실제 DOM 요소와 연결은 `MapViewer` 컴포넌트에서 관리됩니다.

3. **메모리 관리**: 앱이 종료될 때 Viewer를 명시적으로 파괴하지 않아도 되지만, 필요시 `cesiumAction.reset()`을 호출하여 상태를 초기화할 수 있습니다.

4. **정적 파일**: 개발 서버에서는 `cesiumStaticPlugin`이 정적 파일을 서빙하며, 프로덕션 빌드에서는 `viteStaticCopy`가 파일을 복사합니다.

## 참고 자료

- [Cesium 공식 문서](https://cesium.com/docs/)
- [Cesium Vite 설정 가이드](https://cesium.com/blog/2024/02/13/configuring-vite-or-webpack-for-cesiumjs/)

## 문제 해결

### 정적 파일 로드 오류

개발 서버를 재시작하면 해결됩니다:

```bash
yarn dev
```

### Viewer 초기화 실패

브라우저 콘솔에서 에러 메시지를 확인하고, Redux state의 `error` 필드를 확인하세요.

### 타입 에러

`cesiumTypes.ts`에서 필요한 타입을 export하고 있는지 확인하세요.
