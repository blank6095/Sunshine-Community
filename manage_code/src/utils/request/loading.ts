import { ElLoading } from 'element-plus'
import type { LoadingState } from './types'

const loadingState: LoadingState = {
  pending: 0,
  loading: false,
}

let loadingInstance: ReturnType<typeof ElLoading.service> | null = null

export function showLoading(): void {
  loadingState.pending++
  loadingState.loading = true
  if (!loadingInstance) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)',
    })
  }
}

export function hideLoading(): void {
  if (loadingState.pending > 0) {
    loadingState.pending--
  }
  if (loadingState.pending === 0 && loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
    loadingState.loading = false
  }
}

export function forceHideLoading(): void {
  if (loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
  loadingState.pending = 0
  loadingState.loading = false
}

export function getLoadingState(): LoadingState {
  return { ...loadingState }
}
