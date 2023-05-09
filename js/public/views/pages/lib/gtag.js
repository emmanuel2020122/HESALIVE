export const GA_TRACKING_ID ='G-TTBM4CV0GY'
//https://developers.google.com/analytics/devguides/collection/gtag.js/pages
export const pageView = (url) =>{
    window.gtag('config',GA_TRACKING_ID,{
        page_path: url,
    })
}
export const event =({action,category,label,value}) =>{
    window.gtag('event',action,{
        event_category: category,
        event_label: label,
        value: value,
    })
}

