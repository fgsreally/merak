import { Merak } from './merak';
declare global {
    interface Window {
        dImport: (url:string)=>void
        $Merak:any
        $MerakMap:any
        $MerakBus:any
        __merak_url__?:string
        __merak_app__?:Merak
    }
}


export { }