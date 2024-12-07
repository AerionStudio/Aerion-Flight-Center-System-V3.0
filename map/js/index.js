var DOM = {
    tabsNav: document.querySelector('.tabs__nav'),
    tabsNavItems: document.querySelectorAll('.tabs__nav-item'),
    panels: document.querySelectorAll('.tabs__panel')
};

//set active nav element
var setActiveItem = function setActiveItem(elem) {
    DOM.tabsNavItems.forEach(function (el) {
        el.classList.remove('js-active');
    });
    elem.classList.add('js-active');
};

//find active nav element
var findActiveItem = function findActiveItem() {
    var activeIndex = 0;

    for (var i = 0; i < DOM.tabsNavItems.length; i++) {
        if (DOM.tabsNavItems[i].classList.contains('js-active')) {
            activeIndex = i;
            break;
        }
    }

    return activeIndex;
};

//find active nav elements parameters: left coord, width
var findActiveItemParams = function findActiveItemParams(activeItemIndex) {
    var activeTab = DOM.tabsNavItems[activeItemIndex];
    var activeItemWidth = activeTab.offsetWidth - 1;
    var activeItemOffset_left = activeTab.offsetLeft;
    return [activeItemWidth, activeItemOffset_left];
};

//appending decoration block to an active nav element
var appendDecorationNav = function appendDecorationNav() {
    var decorationElem = document.createElement('div');
    decorationElem.classList.add('tabs__nav-decoration');
    decorationElem.classList.add('js-decoration');
    DOM.tabsNav.appendChild(decorationElem);
    return decorationElem;
};

//appending styles to decoration nav element
var styleDecorElem = function styleDecorElem(elem, decorWidth, decorOffset) {
    elem.style.width = "".concat(decorWidth, "px");
    elem.style.transform = "translateX(".concat(decorOffset, "px)");
};

//find active panel
var findActivePanel = function findActivePanel(index) {
    return DOM.panels[index];
};

//set active panel class
var setActivePanel = function setActivePanel(index) {
    DOM.panels.forEach(function (el) {
        el.classList.remove('js-active');
    });
    DOM.panels[index].classList.add('js-active');
};

//onload function
window.addEventListener('load', function () {
    var activeItemIndex = findActiveItem();
    var _findActiveItemParams = findActiveItemParams(activeItemIndex),
        decorWidth = _findActiveItemParams[0],
        decorOffset = _findActiveItemParams[1];

    var decorElem = appendDecorationNav();
    styleDecorElem(decorElem, decorWidth, decorOffset);
    findActivePanel(activeItemIndex);
    setActivePanel(activeItemIndex);
});

//click nav item function
DOM.tabsNav.addEventListener('click', function (e) {
    var navElemClass = 'tabs__nav-item';

    if (e.target.classList.contains(navElemClass)) {
        var clickedTab = e.target;
        var activeItemIndex = Array.from(DOM.tabsNavItems).indexOf(clickedTab);
        setActiveItem(clickedTab);
        var activeItem = findActiveItem();
        var _findActiveItemParams2 = findActiveItemParams(activeItem),
            _decorWidth = _findActiveItemParams2[0],
            _decorOffset = _findActiveItemParams2[1];

        var decorElem = document.querySelector('.js-decoration');
        styleDecorElem(decorElem, _decorWidth, _decorOffset);
        findActivePanel(activeItemIndex);
        setActivePanel(activeItemIndex);
    }
});
