/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
var __importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};define(["require","exports","./Enum/Viewport/ScaffoldIdentifier","jquery","./Storage/Persistent","./Viewport","./Event/ClientRequest","./Event/TriggerRequest","TYPO3/CMS/Core/Ajax/AjaxRequest","TYPO3/CMS/Core/Event/RegularEvent"],(function(e,t,n,a,o,l,i,r,s,d){"use strict";a=__importDefault(a);class u{constructor(){this.loadedModule=null,this.loadedNavigationComponentId="",this.spaceKeyPressedOnCollapsible=!1,a.default(()=>this.initialize())}static getCollapsedMainMenuItems(){return o.isset("modulemenu")?JSON.parse(o.get("modulemenu")):{}}static addCollapsedMainMenuItem(e){const t=u.getCollapsedMainMenuItems();t[e]=!0,o.set("modulemenu",JSON.stringify(t))}static removeCollapseMainMenuItem(e){const t=this.getCollapsedMainMenuItems();delete t[e],o.set("modulemenu",JSON.stringify(t))}static includeId(e,t){if(!e.navigationComponentId&&!e.navigationFrameScript)return t;let n="";return n="TYPO3/CMS/Backend/PageTree/PageTreeElement"===e.navigationComponentId?"web":e.name.split("_")[0],top.fsMod.recentIds[n]&&(t="id="+top.fsMod.recentIds[n]+"&"+t),t}static toggleMenu(e){const t=a.default(n.ScaffoldIdentifierEnum.scaffold);void 0===e&&(e=t.hasClass("scaffold-modulemenu-expanded")),t.toggleClass("scaffold-modulemenu-expanded",!e),e||a.default(".scaffold").removeClass("scaffold-search-expanded").removeClass("scaffold-toolbar-expanded"),o.set("BackendComponents.States.typo3-module-menu",{collapsed:e})}static toggleModuleGroup(e){const t=e.closest(".modulemenu-group"),n=t.querySelector(".modulemenu-group-container"),o="true"===e.attributes.getNamedItem("aria-expanded").value;o?u.addCollapsedMainMenuItem(e.id):u.removeCollapseMainMenuItem(e.id),t.classList.toggle("modulemenu-group-collapsed",o),t.classList.toggle("modulemenu-group-expanded",!o),e.attributes.getNamedItem("aria-expanded").value=(!o).toString(),a.default(n).stop().slideToggle()}static getRecordFromName(e){const t=a.default("#"+e);return{name:e,navigationComponentId:t.data("navigationcomponentid"),navigationFrameScript:t.data("navigationframescript"),navigationFrameScriptParam:t.data("navigationframescriptparameters"),link:t.data("link")}}static highlightModuleMenuItem(e){a.default(".modulemenu-action.modulemenu-action-active").removeClass("modulemenu-action-active").removeAttr("aria-current"),a.default("#"+e).addClass("modulemenu-action-active").attr("aria-current","location")}static getPreviousItem(e){let t=e.parentElement.previousElementSibling;return null===t?u.getLastItem(e):t.firstElementChild}static getNextItem(e){let t=e.parentElement.nextElementSibling;return null===t?u.getFirstItem(e):t.firstElementChild}static getFirstItem(e){return e.parentElement.parentElement.firstElementChild.firstElementChild}static getLastItem(e){return e.parentElement.parentElement.lastElementChild.firstElementChild}static getParentItem(e){return e.parentElement.parentElement.parentElement.firstElementChild}static getFirstChildItem(e){return e.nextElementSibling.firstElementChild.firstElementChild}static getLastChildItem(e){return e.nextElementSibling.lastElementChild.firstElementChild}refreshMenu(){new s(TYPO3.settings.ajaxUrls.modulemenu).get().then(async e=>{const t=await e.resolve();document.getElementById("modulemenu").outerHTML=t.menu,this.initializeModuleMenuEvents(),top.currentModuleLoaded&&u.highlightModuleMenuItem(top.currentModuleLoaded)})}reloadFrames(){l.NavigationContainer.refresh(),l.ContentContainer.refresh()}showModule(e,t,n=null){t=t||"";const a=u.getRecordFromName(e);return this.loadModuleComponents(a,t,new i("typo3.showModule",n))}initialize(){if(null===document.querySelector(".t3js-modulemenu"))return;let e=a.default.Deferred();if(e.resolve(),top.startInModule&&top.startInModule[0]&&a.default("#"+top.startInModule[0]).length>0)e=this.showModule(top.startInModule[0],top.startInModule[1]);else{const t=a.default(".t3js-modulemenu-action[data-link]:first");t.attr("id")&&(e=this.showModule(t.attr("id")))}e.then(()=>{this.initializeModuleMenuEvents(),this.initializeTopBarEvents()})}keyboardNavigation(e,t,n=!1){const a=t.parentElement.attributes.getNamedItem("data-level").value;let o=null;switch(n&&(this.spaceKeyPressedOnCollapsible=!1),e.code){case"ArrowUp":o=u.getPreviousItem(t);break;case"ArrowDown":o=u.getNextItem(t);break;case"ArrowLeft":"1"===a&&t.classList.contains("t3js-modulemenu-collapsible")?("false"===t.attributes.getNamedItem("aria-expanded").value&&u.toggleModuleGroup(t),o=u.getLastChildItem(t)):"2"===a&&(o=u.getPreviousItem(u.getParentItem(t)));break;case"ArrowRight":"1"===a&&t.classList.contains("t3js-modulemenu-collapsible")?("false"===t.attributes.getNamedItem("aria-expanded").value&&u.toggleModuleGroup(t),o=u.getFirstChildItem(t)):"2"===a&&(o=u.getNextItem(u.getParentItem(t)));break;case"Home":o=e.ctrlKey&&"2"===a?u.getFirstItem(u.getParentItem(t)):u.getFirstItem(t);break;case"End":o=e.ctrlKey&&"2"===a?u.getLastItem(u.getParentItem(t)):u.getLastItem(t);break;case"Space":case"Enter":"1"===a&&t.classList.contains("t3js-modulemenu-collapsible")&&("Enter"===e.code&&e.preventDefault(),u.toggleModuleGroup(t),"true"===t.attributes.getNamedItem("aria-expanded").value&&(o=u.getFirstChildItem(t),"Space"===e.code&&(this.spaceKeyPressedOnCollapsible=!0)));break;case"Esc":case"Escape":"2"===a&&(o=u.getParentItem(t),u.toggleModuleGroup(o));break;default:o=null}null!==o&&(e.defaultPrevented||e.preventDefault(),o.focus())}initializeModuleMenuEvents(){const e=document.querySelector(".t3js-modulemenu"),t=function(e){"Space"===e.code&&this.spaceKeyPressedOnCollapsible&&(e.preventDefault(),this.spaceKeyPressedOnCollapsible=!1)}.bind(this);new d("keydown",this.keyboardNavigation).delegateTo(e,".t3js-modulemenu-action"),e.querySelectorAll('[data-level="2"] .t3js-modulemenu-action[data-link]').forEach(e=>{e.addEventListener("keyup",t)}),new d("keyup",(e,t)=>{"Space"===e.code&&e.preventDefault()}).delegateTo(e,".t3js-modulemenu-collapsible"),new d("click",(e,t)=>{e.preventDefault(),this.showModule(t.id,"",e)}).delegateTo(e,".t3js-modulemenu-action[data-link]"),new d("click",(e,t)=>{e.preventDefault(),u.toggleModuleGroup(t)}).delegateTo(e,".t3js-modulemenu-collapsible")}initializeTopBarEvents(){const e=document.querySelector(".t3js-scaffold-toolbar");new d("keydown",(e,t)=>{this.keyboardNavigation(e,t)}).delegateTo(e,".t3js-modulemenu-action"),new d("click",(e,t)=>{e.preventDefault(),this.showModule(t.id,"",e)}).delegateTo(e,".t3js-modulemenu-action[data-link]"),new d("click",e=>{e.preventDefault(),u.toggleMenu()}).bindTo(document.querySelector(".t3js-topbar-button-modulemenu")),new d("click",e=>{e.preventDefault(),u.toggleMenu(!0)}).bindTo(document.querySelector(".t3js-scaffold-content-overlay"))}loadModuleComponents(e,t,n){const o=e.name,i=l.ContentContainer.beforeSetUrl(n);return i.then(a.default.proxy(()=>{e.navigationComponentId?this.loadNavigationComponent(e.navigationComponentId):e.navigationFrameScript?(l.NavigationContainer.show("typo3-navigationIframe"),this.openInNavFrame(e.navigationFrameScript,e.navigationFrameScriptParam,new r("typo3.loadModuleComponents",n))):l.NavigationContainer.hide(!0),u.highlightModuleMenuItem(o),this.loadedModule=o,t=u.includeId(e,t),this.openInContentFrame(e.link,t,new r("typo3.loadModuleComponents",n)),top.currentSubScript=e.link,top.currentModuleLoaded=o},this)),i}loadNavigationComponent(t){const n=this;if(l.NavigationContainer.show(t),t===this.loadedNavigationComponentId)return;const o=t.replace(/[/]/g,"_");""!==this.loadedNavigationComponentId&&a.default("#navigationComponent-"+this.loadedNavigationComponentId.replace(/[/]/g,"_")).hide(),a.default('.t3js-scaffold-content-navigation [data-component="'+t+'"]').length<1&&a.default(".t3js-scaffold-content-navigation").append(a.default("<div />",{class:"scaffold-content-navigation-component","data-component":t,id:"navigationComponent-"+o})),e([t],e=>{Object.values(e)[0].initialize("#navigationComponent-"+o),l.NavigationContainer.show(t),n.loadedNavigationComponentId=t})}openInNavFrame(e,t,n){const a=e+(t?(e.includes("?")?"&":"?")+t:""),o=l.NavigationContainer.getUrl(),i=l.NavigationContainer.setUrl(e,new r("typo3.openInNavFrame",n));return o!==a&&("resolved"===i.state()?l.NavigationContainer.refresh():i.then(l.NavigationContainer.refresh)),i}openInContentFrame(e,t,n){let a;if(top.nextLoadModuleUrl)a=l.ContentContainer.setUrl(top.nextLoadModuleUrl,new r("typo3.openInContentFrame",n)),top.nextLoadModuleUrl="";else{const o=e+(t?(e.includes("?")?"&":"?")+t:"");a=l.ContentContainer.setUrl(o,new r("typo3.openInContentFrame",n))}return a}}top.TYPO3.ModuleMenu||(top.TYPO3.ModuleMenu={App:new u});return top.TYPO3.ModuleMenu}));