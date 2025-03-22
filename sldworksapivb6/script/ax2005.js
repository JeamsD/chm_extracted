/* Wire up the bodyload handler (set here rather than in the body element
    in order to avoid a HTML Help viewer bug with printing multiple topics */
window.onload = bodyLoad;

/* Set body initially hidden unless we are printing */
document.write("<style media='screen'>body {visibility: hidden}</style>");

/* Begin Common utility functions */

/* This is required for user data support in .chms */
var curURL = document.location + ".";
var pos = curURL.indexOf("mk:@MSITStore");
var scrollPos=null;
if( pos == 0 )
{
    curURL = "ms-its:" + curURL.substring(14,curURL.length-1);
    document.location.replace(curURL);
}

/* Returns a document element using the Firefox friendly getElementById */
function documentElement(id)
{
    return document.getElementById(id);
}

/* Returns the source element of an event */
function sourceElement(e)
{
    if (window.event)
    {
        e = window.event;
    }

    return e.srcElement? e.srcElement : e.target;
}

/* Cancels an event, preventing further bubbling and returning false to cancel default behavior */
function cancelEvent(e)
{
    e.returnValue = false;
    e.cancelBubble = true;

    if (e.stopPropagation)
    {
        e.stopPropagation();
        e.preventDefault();
    }
}

/* Returns an elements absolute position, allowing for the non-scrolling header */
function getElementPosition(e)
{
    var offsetLeft = 0;
    var offsetTop = 0;

    while (e)
    {
        // Allow for the scrolling body region in IE
        if (msieversion() > 4)
        {
            offsetLeft += (e.offsetLeft - e.scrollLeft);
            offsetTop += (e.offsetTop - e.scrollTop);
        }
        else
        {
            offsetLeft += e.offsetLeft ;
            offsetTop += e.offsetTop;
        }

        e = e.offsetParent;
    }

    if (navigator.userAgent.indexOf('Mac') != -1 && typeof document.body.leftMargin != 'undefined')
    {
        offsetLeft += document.body.leftMargin;
        offsetTop += document.body.topMargin;
    }

    return {left:offsetLeft,top:offsetTop};
}

/* Return Microsoft Internet Explorer (major) version number, or 0 for others. */
function msieversion()
{
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf ( "MSIE " );

    if ( msie > 0 ) // is Microsoft Internet Explorer; return version number
    {
        return parseInt ( ua.substring ( msie+5, ua.indexOf ( ".", msie ) ) );
    }
    else
    {
        return 0;    // is other browser
    }
}

/* To hide all popup boxes */
function hideBoxes()
{
    var divs = document.getElementsByTagName("DIV");

    if (divs)
    {
        for(var idiv = 0; idiv < divs.length; idiv++)
        {
            var div = divs[idiv];

            if (div.className)
            {
                if (div.className == "dxpopupbubble" || div.className == "hspopupbubble" || div.className == "hsglossaryreference")
                {
                    div.style.visibility = "hidden";
                }
            }
        }
    }
}

/* Show a popup box */
function showBox(Name,e,button)
{
    if (window.event)
    {
        e = window.event;
    }

    hideBoxes();

    if(!button)
    {
        button = sourceElement(e);
    }
    cancelEvent(e);
    var div = documentElement(Name);

    if (div && button)
    {
        div.style.height = "";
        div.style.left = (getElementPosition(button).left) + "px";
        div.style.top = (getElementPosition(button).top + button.offsetHeight) + "px";
        div.style.visibility = "visible";
    }
}

/* End Common utility functions */


/* Shows a popup parameter box */
function showParamBox(e)
{
    if (window.event)
    {
        e = window.event;
    }

    var button = sourceElement(e);
    var documentWidth;
    var documentHeight;
    var boxWidth;
    var pixelLeft;
    var pixelTop;
    var boxHeight;
    var div = documentElement(button.id + "_box");

    cancelEvent(e);
    hideBoxes();

    if (div && button)
    {
        // Have the browser size the box
        div.style.height = "";
        div.style.width = "";

        // Clear any tooltip so it doesn't appear above the popup
        button.title = "";

        pixelTop = getElementPosition(button).top + 14;

        // Check if the box would go off the bottom of the visible area
        documentHeight = document.body.clientHeight;
        boxHeight = div.clientHeight;
        if (pixelTop + boxHeight > documentHeight)
        {
            // If the box won't fit both above and below the link
            //  using the default width then make the box wider
            if (boxHeight >= pixelTop)
            {
                div.style.width = "80%";
            }
            else
            {
                pixelTop = pixelTop - 14 - boxHeight;
            }
        }
        div.style.top = pixelTop + "px";
        documentWidth = document.body.clientWidth;
        boxWidth = div.clientWidth;
        pixelLeft = button.offsetLeft;

                // Check if the box would go off the edge of the visible area           
        if (pixelLeft + boxWidth > documentWidth)
        {
            pixelLeft = documentWidth - boxWidth - 5;
        }
        div.style.left = pixelLeft + "px";
                
                // Show the box
        div.style.visibility = "visible";
    }
}


/* Begin non-scrolling region support */

var isDesignTime = false;

function bodyResize()
{
    resizeBan();
}

function bodyClick(e)
{
    if (window.event)
    {
        e = window.event;
    }
    if(sourceElement(e))
    {
        try
        {
            if(sourceElement(e).tagName != "INPUT")
            {
                if (sourceElement(e).className != "languageFilter" && sourceElement(e).className != "membersFilter" && sourceElement(e).className != "communityFilter")
                {
                hideBoxes();
                resizeBan();
                };
            }
        }
        catch(e)
        { }
    }
}

function resizeBan()
{
    if (msieversion() > 4)
    {
        try
        {
            if (document.body.clientWidth==0)
            {
                return;
            }

            hideBoxes();

            var oBanner= documentElement("pagetop");
            var oText= documentElement("pagebody");
            var oFooter = documentElement("nonscrollingpagefooter");
            var footerHeight = 0;
            if (oFooter != null)
            {
                footerHeight = oFooter.offsetHeight;
            }

            if (oText == null)
            {
                return;
            }

            var oBannerrow1 = documentElement("projectnamebanner");
            var oTitleRow = documentElement("pagetitlebanner");

            if (oBannerrow1 != null)
            {
                var iScrollWidth = document.body.scrollWidth;
                oBannerrow1.style.marginRight = 0 - iScrollWidth;
            }

            if (oTitleRow != null)
            {
                oTitleRow.style.padding = "0px 10px 0px 22px; ";
            }

            if (oBanner != null)
            {
                document.body.scroll = "no";
                oText.style.overflow= "auto";
                oBanner.style.width= document.body.offsetWidth-2;
                oText.style.top=0;

                if (document.body.offsetHeight > oBanner.offsetHeight)
                {
                    oText.style.height= document.body.offsetHeight - (oBanner.offsetHeight+4) - footerHeight;
                }
                else
                {
                    oText.style.height=0;
                }

                if(scrollPos!=null)
                {
                    oText.scrollTop = scrollPos;
                    scrollPos = null;
                }
            }

            try
            {
                documentElement("nstext").setActive();
            }
            catch(e)
            {
            }
        }
        catch(e)
        {
        }
    }
}

/* End non-scrolling region support */


/* Begin Document load/unload/print support */

/* Called before custom body load script */
function bodyLoadCommonBefore()
{
    if (scrollPos == null && curURL.indexOf("#") != -1)
    {
        var oBanner= documentElement("pagetop");
        scrollPos = document.body.scrollTop - oBanner.offsetHeight;
    }

    resizeBan();

    document.body.onclick = bodyClick;
    document.body.onresize = bodyResize;
    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;
    window.onunload = windowUnload;
}

/* Called after custom body load script */
function bodyLoadCommonAfter()
{
    wireUpEventHandlers();
    loadSettings();

    // make body visible, now that we're ready to render
    document.body.style.visibility = "visible";
}

/* Saves the scroll position */
function windowUnload()
{
    saveSettings();
}

/* Common settings load script */
function loadSettingsCommon()
{
    // load the expand / collapse states
    loadSections();
}

/* Common settings save script */
function saveSettingsCommon()
{
    // save the expand / collapse states
    saveSections();
}

/* Removes the non-scrolling region and ensures everything is visible for print */
function beforePrint()
{
    var allElements;

    if (window.text)
    {
        document.all.text.style.height = "auto";
    }

    allElements = document.getElementsByTagName("*");

    for(var i=0; i < allElements.length; i++)
    {
        if (allElements[i].tagName == "BODY")
        {
            allElements[i].scroll = "yes";
        }
        if (allElements[i].id == "pagetop")
        {
            allElements[i].style.margin = "0px 0px 0px 0px";
            allElements[i].style.width = "100%";
        }
        if (allElements[i].id == "pagebody")
        {
            allElements[i].style.overflow = "visible";
            allElements[i].style.top = "5px";
            allElements[i].style.width = "100%";
            allElements[i].style.padding = "0px 10px 0px 30px";
        }
        if (allElements[i].id == "pagetoptable1row2" || allElements[i].id == "pagetoptable2row1" || allElements[i].id == "feedbacklink")
        {
            allElements[i].style.display = "none";
        }
        if (allElements[i].className == "LanguageSpecific")
        {
            allElements[i].style.display = "block";
        }
    }
}

/* Refresh the page after a print */
function afterPrint()
{
    document.location.reload();
}

/* End Document load/unload/print support */


/* Begin User Data support */

function getDataCache()
{
    if (isDesignTime)
    {
        if (getWindowExternal())
        {
            if (window.external.IsInnovasysDesigner)
            {
                return window.external;
            }
        }
    }
    
    return documentElement("userDataCache");
}

function getWindowExternal()
{
    try
    {
        return window.external;
    }
    catch(e)
    {
    }
}

function load(key)
{
    var dataCacheObject;

    try
    {
        dataCacheObject = getDataCache();
        dataCacheObject.load("innSettings");
        var value = dataCacheObject.getAttribute(key);
        return value;
    }
    catch(e)
    {
    }
}

function save(key, value)
{
    var dataCacheObject;

    try
    {
        dataCacheObject = getDataCache();
        dataCacheObject.setAttribute(key, value);
        dataCacheObject.save("innSettings");
    }
    catch(e)
    {
    }
}

function removeAttribute(key)
{
    var dataCacheObject;

    try
    {
        dataCacheObject = getDataCache();
        dataCacheObject.removeAttribute(key);
        dataCacheObject.save("innSettings");
    }
    catch(e)
    {
    }
}

/* End User Data support */


/* Begin Expanding sections support */

var collapsedSections = new Array();

/* Wires up the expand / collapse functionality */
function wireUpEventHandlers()
{
    var elements=document.getElementsByTagName("SPAN");

    for(var i=0;i<elements.length;i++)
    {
        var span = elements[i];
        if(span.className == "expandcollapse")
        {
            span.onclick = toggleExpanded;
            span.onkeypress = toggleExpandedOnKey;
        }
    }

    if(documentElement("toggleExpandedAll"))
    {
        documentElement("toggleExpandedAll").onclick = toggleExpandedAll;
        documentElement("toggleExpandedAll").onkeypress = toggleExpandedAllOnKey;
    }
}

function toggleExpanded(img)
{
    // Firefox passes in the event object from the event handler, so
    //  we check for that and set to null
    if(img)
    {
        if(img.tagName == null)
        {
            img=null;
        }
    }

    // Find the expand & collapse image
    if(!img)
    {
        if(this)
        {
            img = findExpandCollapseImage(this);
        }
    }

    if(img)
    {
        if(isSectionCollapsed(img.id) == true)
        {
            img.src = documentElement("collapseImage").src;
            expandSection(img);
            removeCollapsedItem(img.id);
            if(img.id.indexOf("Family", 0) == 0)
            {
                protectedMembers = "on";
                configureMembersFilterCheckboxes();
                changeMembersFilterLabel();
            }
        }
        else
        {
            img.src = documentElement("expandImage").src;
            collapseSection(img);
            addCollapsedSection(img.id);
        }

        setCollapseAll();
    }
}

function findExpandCollapseImage(sourceElement)
{
    var e;
    var elements;

    if(sourceElement.tagName == "IMG" && sourceElement.className == "toggle")
    {
        return(sourceElement);
    }
    else
    {
        if(sourceElement)
        {
            elements = sourceElement.getElementsByTagName("IMG");

            for(var i=0;i<elements.length;i++)
            {
                e = elements[i];
                if(e.className == "toggle")
                {
                    return(e);
                }
            }
        }
    }
}

function toggleExpandedAll()
{
    var elements = document.getElementsByName("toggleSwitch");
    var toggleExpandedAllImage = documentElement("toggleExpandedAllImage");

    // All currently collapsed
    if(isSectionCollapsed(toggleExpandedAllImage.id) == true)
    {
        toggleExpandedAllImage.src = documentElement("collapseImage").src;
        removeCollapsedItem(toggleExpandedAllImage.id);

        for(var i=0;i<elements.length;i++)
        {
            expandSection(elements[i]);
            elements[i].src = documentElement("collapseImage").src;
            removeCollapsedItem(elements[i].id);

            if(elements[i].id.indexOf("Protected",0) == 0)
            {
                protectedMembers = "on";
            }
        }

        setToggleExpandedAllLabel(false);
    }
    // All currently expanded
    else
    {
        toggleExpandedAllImage.src = documentElement("expandImage").src;
        addCollapsedSection(toggleExpandedAllImage.id);

        for(var i=0;i<elements.length;i++)
        {
            collapseSection(elements[i]);
            elements[i].src = documentElement("expandImage").src;
            addCollapsedSection(elements[i].id);
        }

        setToggleExpandedAllLabel(true);
    }
}

function toggleExpandedAllOnKey(e)
{
    if(window.event)
    {
        e = window.event;
    }

    if(e.keyCode == 13)
    {
        toggleExpandedAll();
    }
}

function toggleExpandedOnKey(e)
{
    if(window.event)
    {
        e = window.event;
    }

    if(e.keyCode == 13)
    {
        toggleExpanded(findExpandCollapseImage(e.srcElement));
    }
}

function expandSection(imageItem)
{
    if(imageItem.id != "toggleExpandedAllImage")
    {
        imageItem.parentNode.parentNode.nextSibling.style.display = "";
    }
}

function collapseSection(imageItem)
{
    if(imageItem.id != "toggleExpandedAllImage")
    {
        imageItem.parentNode.parentNode.nextSibling.style.display = "none";
    }
}

function setCollapseAll()
{
    var toggleElements = document.getElementsByName("toggleSwitch");
    var allCollapsed = true;

    if(document.getElementById("expandAllLabel"))
    {
        for(var i=0; i < toggleElements.length; i++)
        {
            allCollapsed = allCollapsed && isSectionCollapsed(toggleElements[i].id);
        }

        if(allCollapsed)
        {
            this.src = documentElement("expandAllImage").src;
            addCollapsedSection("toggleExpandedAllImage");
        }
        else
        {
            this.src = documentElement("collapseAllImage").src;
            removeCollapsedItem("toggleExpandedAllImage");
        }

        setToggleExpandedAllLabel(allCollapsed);
    }
}

function setToggleExpandedAllLabel(allCollapsed)
{
    var labelElement;

    labelElement = document.getElementById("collapseAllLabel");

    if(labelElement == null)
    {
        return;
    }

    labelElement.style.display = "none";
    labelElement = document.getElementById("expandAllLabel");
    labelElement.style.display = "none";

    if(allCollapsed)
    {
        labelElement = document.getElementById("expandAllLabel");
        labelElement.style.display = "inline";
    }
    else
    {
        labelElement = document.getElementById("collapseAllLabel");
        labelElement.style.display = "inline";
    }
}

function isSectionCollapsed(imageId)
{
    for(var i=0; i < collapsedSections.length; ++i)
    {
        if(imageId == collapsedSections[i])
        {
            return true;
        }
    }

    return false;
}

function addCollapsedSection(imageId)
{
    if(isSectionCollapsed(imageId) == false)
    {
        collapsedSections[collapsedSections.length] = imageId;
    }
}

function removeCollapsedItem(imageId)
{
    for(var i=0; i < collapsedSections.length; ++i)
    {
        if(imageId == collapsedSections[i])
        {
            collapsedSections.splice(i, 1);
        }
    }
}

function saveSections()
{
    var x = 0;

    cleanUserDataStore();
    for(var i=0; i < collapsedSections.length; ++i)
    {
        if(shouldSave(collapsedSections[i]) == true)
        {
            save("imageValue" + x, collapsedSections[i]);
            x++;
        }
    }
}

function loadSections()
{
    var i = 0;
    var imageId = load("imageValue" + i);

    while(imageId != null)
    {
        var imageItem = document.getElementById(imageId);

        if(imageItem != null)
        {
            if(imageItem.id.indexOf("Family", 0) == 0)
            {
                if(protectedMembers == "on")
                {
                    toggleExpanded(imageItem);
                }
            }
            else
            {
                toggleExpanded(imageItem);
            }
        }
        else
        {
            addCollapsedSection(imageId);
        }

        i++;
        imageId = load("imageValue" + i);
    }
    setCollapseAll();
}

function cleanUserDataStore()
{
    var i = 0;
    var imageId = load("imageValue" + i);

    while(imageId != null)
    {
        removeAttribute("imageValue" + i);
        i++;
        imageId = load("imageValue" + i);
    }
}

function shouldSave(imageId)
{
    var toggleName;

    if(imageId == "toggleExpandedAllImage")
    {
        return false;
    }

    toggleName = "procedureToggle";

    if(imageId.indexOf(toggleName, 0) == 0)
    {
        return false;
    }

    toggleName = "sectionToggle";

    if(imageId.indexOf(toggleName, 0) == 0)
    {
        return false;
    }

    return true;
}
function openSectionById(id)
{
    var e=documentElement(id);

    if(e)
    {
        if(isSectionCollapsed(e.id) == true)
        {
            toggleExpanded(e);
        }
    }
}

/* End Expand / Collapse */


/* Begin save / Restore Scroll Position */

var scrollPos = null;

function loadAll()
{
    var historyObject = getHistoryObject();

    if(historyObject)
    {
        var scrollValue = historyObject.getAttribute("Scroll");

        if(scrollValue)
        {
            if(scrollValue != 0)
            {
                try
                {
                    scrollPos = scrollValue;
                    documentElement("pagebody").scrollTop = scrollPos;
                }
                catch(e)
                {
                }
            }
        }
    }
}
function saveAll()
{
    var historyObject = getHistoryObject();

    if(historyObject)
    {
        try
        {
            historyObject.setAttribute("Scroll", documentElement("pagebody").scrollTop);
        }
        catch(e)
        {
        }
    }
}
function getHistoryObject()
{
    if (isDesignTime)
    {
        try
        {
            var externalObject = window.external;

            if (externalObject)
            {
                if (externalObject.IsInnovasysDesigner)
                {
                    return window.external;
                }
                else
                {
                    externalObject = false;
                }
            }
        }
        catch(e)
        {
        }
    }
    
    if (!externalObject)
    {
        return documentElement("allHistory");
    }
}

/* End save / Restore Scroll Position */


/* Begin Copy Code */

function copyCode(key)
{
    var trElements = getTABLE(key).getElementsByTagName("tr");
    for(var i=0; i < trElements.length; ++i)
    {
        if(getTABLE(key) == getTABLE(trElements[i]) && getTR(key) != trElements[i])
        {
            window.clipboardData.setData("Text", trElements[i].innerText);
            break;
        }
    }
}

function getTR(obj)
{
    while(obj)
    {
        if(obj.tagName == "TR")
            return obj;
        else
            obj = obj.parentElement;
    }
}

function getTABLE(obj)
{
    while(obj)
    {
        if(obj.tagName == "TABLE")
            return obj;
        else
            obj = obj.parentElement;
    }
}

function changeCopyCodeIcon(key,highlight)
{
    var imageElements = document.getElementsByName("ccImage");

    for(var i=0; i<imageElements.length; ++i)
    {
        try
        {
            if(imageElements[i].parentElement == key)
            {
                if(highlight)
                {
                    imageElements[i].src = documentElement("copyHoverImage").src;
                }
                else
                {
                    imageElements[i].src = documentElement("copyImage").src;
                }
            }
        }
        catch(e)
        {
        }
    }
}

function copyCode_CheckKey(key)
{
    var e;

    if (window.event)
    {
        e = window.event;
    }

    if(e.keyCode == 13)
    {
        copyCode(key);
    }
}

/* End Copy Code */


/* Begin XML expand / collapse */

// Detect and switch the display of CDATA and comments from an inline view
//  to a block view if the comment or CDATA is multi-line.
function f(e)
{
    // if this element is an inline comment, and contains more than a single
    //  line, turn it into a block comment.
    if (e.className == "ci")
    {
        if (e.children(0).innerText.indexOf("\n") > 0)
        {
            fix(e, "cb");
        }
    }

    // if this element is an inline cdata, and contains more than a single
    //  line, turn it into a block cdata.
    if (e.className == "di")
    {
        if (e.children(0).innerText.indexOf("\n") > 0)
        {
            fix(e, "db");
        }
    }

    // remove the id since we only used it for cleanup
    e.id = "";
}

// Fix up the element as a "block" display and enable expand/collapse on it
function fix(e, cl)
{
    var j;
    var k;

    // change the class name and display value
    e.className = cl;
    e.style.display = "block";

    // mark the comment or cdata display as a expandable container
    j = e.parentElement.children(0);
    j.className = "c";

    // find the +/- symbol and make it visible - the dummy link enables tabbing
    k = j.children(0);
    k.style.visibility = "visible";
    k.href = "#";
}

// Change the +/- symbol and hide the children.  This function works on "element"
//  displays
function ch(e)
{
    var i;

    // find the +/- symbol
    var mark = e.children(0).children(0);

    // if it is already collapsed, expand it by showing the children
    if (mark.innerText == "+")
    {
        mark.innerText = "-";
        for (i = 1; i < e.children.length; i++)
        {
            e.children(i).style.display = "block";
        }
    }
    
    // if it is expanded, collapse it by hiding the children
    else if (mark.innerText == "-")
    {
        mark.innerText = "+";
        for (i = 1; i < e.children.length; i++)
        {
            e.children(i).style.display="none";
        }
    }
}

// Change the +/- symbol and hide the children.  This function work on "comment"
//  and "cdata" displays
function ch2(e)
{
    var contents;

    // find the +/- symbol, and the "PRE" element that contains the content
    var mark = e.children(0).children(0);
    contents = e.children(1);

    // if it is already collapsed, expand it by showing the children
    if (mark.innerText == "+")
    {
        mark.innerText = "-";

        // restore the correct "block"/"inline" display type to the PRE
        if (contents.className == "db" || contents.className == "cb")
        {
            contents.style.display = "block";
        }
        else
        {
            contents.style.display = "inline";
        }
    }
    // if it is expanded, collapse it by hiding the children
    else
    {
        if (mark.innerText == "-")
        {
            mark.innerText = "+";
            contents.style.display = "none";
        }
    }
}

// Handle a mouse click
function cl()
{
    var e = window.event.srcElement;

    // make sure we are handling clicks upon expandable container elements
    if (e.className != "c")
    {
        e = e.parentElement;
        if (e.className != "c")
        {
            return;
        }
    }
    e = e.parentElement;

    // call the correct funtion to change the collapse/expand state and display
    if (e.className == "e")
    {
        ch(e);
    }
    
    if (e.className == "k")
    {
        ch2(e);
    }
}

// Dummy function for expand/collapse link navigation - trap onclick events instead
function ex()
{
}

// Erase bogus link info from the status window
function h()
{
    window.status=" ";
}

/* End XML Expand / Collapse */


function bodyLoad()
{
    bodyLoadCommonBefore();
    bodyLoadCommonAfter();
}

function loadSettings()
{
    loadSettingsCommon();
}

function saveSettings()
{
    saveSettingsCommon();
}