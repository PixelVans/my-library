const rootStyles = window.getComputedStyle
    (document.documentElement)

if (rootStyles.getPropertyValue("--book-cover-width-large") !== null
&& rootStyles.getPropertyValue("--book-cover-width-large") !== '')
{
    ready()
} else {
    document.getElementById("main-css")
    .addEventListener("load", ready)
    }


function ready() {

    const coverwidth = parseFloat(rootStyles.getPropertyValue
        ("--book-cover-width-large"))
    
        const coverAspectRatio =parseFloat(rootStyles.getPropertyValue
        ("--book-cover-aspect-ratio")) 
    
        const coverHeight =parseFloat(coverwidth/coverAspectRatio) 
    
    // Register FilePond plugins
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
);

FilePond.setOptions({
    stylePanelAspectRatio: 1/ coverAspectRatio,
    imageResizeTargetWidth: coverwidth,
    imageResizeTargetHeight: coverHeight ,
})

// Initialize FilePond
FilePond.parse(document.body);
}









