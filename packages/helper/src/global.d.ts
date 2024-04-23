
import type { Merak } from "merak-core"
declare global {
    interface Window {
        __m_app__: Merak
        __m_map__: Map<string,Merak>
        rawWindow: Window
    }
}


export { }