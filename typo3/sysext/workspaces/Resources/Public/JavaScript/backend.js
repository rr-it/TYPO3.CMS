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
import DocumentService from"@typo3/core/document-service.js";import{html}from"lit";import"@typo3/backend/element/icon-element.js";import{SeverityEnum}from"@typo3/backend/enum/severity.js";import"@typo3/backend/input/clearable.js";import"@typo3/workspaces/renderable/record-table.js";import"@typo3/backend/element/pagination.js";import Workspaces from"@typo3/workspaces/workspaces.js";import{default as Modal}from"@typo3/backend/modal.js";import Persistent from"@typo3/backend/storage/persistent.js";import Utility from"@typo3/backend/utility.js";import windowManager from"@typo3/backend/window-manager.js";import RegularEvent from"@typo3/core/event/regular-event.js";import{topLevelModuleImport}from"@typo3/backend/utility/top-level-module-import.js";import{selector}from"@typo3/core/literals.js";import IconHelper from"@typo3/workspaces/utility/icon-helper.js";import DeferredAction from"@typo3/backend/action-button/deferred-action.js";var Identifiers;!function(e){e.searchForm="#workspace-settings-form",e.searchTextField='#workspace-settings-form input[name="search-text"]',e.searchSubmitBtn='#workspace-settings-form button[type="submit"]',e.depthSelector='#workspace-settings-form [name="depth"]',e.languageSelector='#workspace-settings-form select[name="languages"]',e.stagesSelector='#workspace-settings-form select[name="stages"]',e.workspaceActions=".workspace-actions",e.chooseStageAction='.workspace-actions [name="stage-action"]',e.chooseSelectionAction='.workspace-actions [name="selection-action"]',e.chooseMassAction='.workspace-actions [name="mass-action"]',e.publishAction='[data-action="publish"]',e.prevStageAction='[data-action="prevstage"]',e.nextStageAction='[data-action="nextstage"]',e.changesAction='[data-action="changes"]',e.previewAction='[data-action="preview"]',e.openAction='[data-action="open"]',e.versionAction='[data-action="version"]',e.removeAction='[data-action="remove"]',e.expandAction='[data-action="expand"]',e.workspaceRecipientsSelectAll=".t3js-workspace-recipients-selectall",e.workspaceRecipientsDeselectAll=".t3js-workspace-recipients-deselectall",e.container="#workspace-panel",e.contentsContainer="#workspace-contents",e.noContentsContainer="#workspace-contents-empty",e.previewLinksButton=".t3js-preview-link",e.pagination="#workspace-pagination"}(Identifiers||(Identifiers={}));class Backend extends Workspaces{constructor(){super(),this.settings={dir:"ASC",id:TYPO3.settings.Workspaces.id,depth:1,language:"all",limit:30,query:"",sort:"label_Workspace",start:0,filterTxt:""},this.paging={currentPage:1,totalPages:1,totalItems:0},this.markedRecordsForMassAction=[],this.handleCheckboxStateChanged=e=>{const t=e.target,n=t.closest("tr"),a=t.checked,s=n.dataset.table+":"+n.dataset.uid+":"+n.dataset.t3ver_oid;if(a)this.markedRecordsForMassAction.push(s);else{const e=this.markedRecordsForMassAction.indexOf(s);e>-1&&this.markedRecordsForMassAction.splice(e,1)}n.dataset.collectionCurrent?Backend.changeCollectionChildrenState(n.dataset.collectionCurrent,a):n.dataset.collection&&(Backend.changeCollectionChildrenState(n.dataset.collection,a),Backend.changeCollectionParentState(n.dataset.collection,a));document.querySelector(Identifiers.chooseMassAction).disabled=this.markedRecordsForMassAction.length>0},this.openIntegrityWarningModal=()=>{const e=Modal.confirm(TYPO3.lang["window.integrity_warning.title"],html`<p>${TYPO3.lang["integrity.hasIssuesDescription"]}<br>${TYPO3.lang["integrity.hasIssuesQuestion"]}</p>`,SeverityEnum.warning);return e.addEventListener("button.clicked",(()=>e.hideModal())),e},topLevelModuleImport("@typo3/workspaces/renderable/send-to-stage-form.js"),topLevelModuleImport("@typo3/workspaces/renderable/record-information.js"),DocumentService.ready().then((()=>{this.registerEvents(),this.notifyWorkspaceSwitchAction(),this.settings.depth=document.querySelector(Identifiers.depthSelector)?.value,this.settings.language=document.querySelector(Identifiers.languageSelector)?.value,this.settings.stage=document.querySelector(Identifiers.stagesSelector)?.value,null!==document.querySelector(Identifiers.container)&&this.getWorkspaceInfos()}))}static refreshPageTree(){top.document.dispatchEvent(new CustomEvent("typo3:pagetree:refresh"))}static changeCollectionParentState(e,t){const n=document.querySelector('tr[data-collection-current="'+e+'"] input[type=checkbox]');null!==n&&n.checked!==t&&(n.checked=t,n.dataset.manuallyChanged="true",n.dispatchEvent(new CustomEvent("multiRecordSelection:checkbox:state:changed",{bubbles:!0,cancelable:!1})))}static changeCollectionChildrenState(e,t){const n=document.querySelectorAll(selector`tr[data-collection="${e}"] input[type=checkbox]`);n.length&&n.forEach((e=>{e.checked!==t&&(e.checked=t,e.dataset.manuallyChanged="true",e.dispatchEvent(new CustomEvent("multiRecordSelection:checkbox:state:changed",{bubbles:!0,cancelable:!1})))}))}notifyWorkspaceSwitchAction(){const e=document.querySelector("main[data-workspace-switch-action]");if(e.dataset.workspaceSwitchAction){const t=JSON.parse(e.dataset.workspaceSwitchAction);top.TYPO3.WorkspacesMenu.performWorkspaceSwitch(t.id,t.title),top.document.dispatchEvent(new CustomEvent("typo3:pagetree:refresh")),top.TYPO3.ModuleMenu.App.refreshMenu()}}checkIntegrity(e){return this.sendRemoteRequest(this.generateRemotePayload("checkIntegrity",e))}registerEvents(){new RegularEvent("click",((e,t)=>{const n=t.closest("tr");this.checkIntegrity({selection:[{liveId:n.dataset.uid,versionId:n.dataset.t3ver_oid,table:n.dataset.table}],type:"selection"}).then((async e=>{"warning"===(await e.resolve())[0].result.result?this.openIntegrityWarningModal().addEventListener("confirm.button.ok",(()=>{this.renderPublishModal(n)})):this.renderPublishModal(n)}))})).delegateTo(document,Identifiers.publishAction),new RegularEvent("click",((e,t)=>{this.sendToStage(t.closest("tr"),"prev")})).delegateTo(document,Identifiers.prevStageAction),new RegularEvent("click",((e,t)=>{this.sendToStage(t.closest("tr"),"next")})).delegateTo(document,Identifiers.nextStageAction),new RegularEvent("click",this.viewChanges.bind(this)).delegateTo(document,Identifiers.changesAction),new RegularEvent("click",this.openPreview.bind(this)).delegateTo(document,Identifiers.previewAction),new RegularEvent("click",((e,t)=>{const n=t.closest("tr"),a=TYPO3.settings.FormEngine.moduleUrl+"&returnUrl="+encodeURIComponent(document.location.href)+"&id="+TYPO3.settings.Workspaces.id+"&edit["+n.dataset.table+"]["+n.dataset.uid+"]=edit";window.location.href=a})).delegateTo(document,Identifiers.openAction),new RegularEvent("click",((e,t)=>{const n=t.closest("tr"),a="pages"===n.dataset.table?n.dataset.t3ver_oid:n.dataset.pid;window.location.href=TYPO3.settings.WebLayout.moduleUrl+"&id="+a})).delegateTo(document,Identifiers.versionAction),new RegularEvent("click",this.confirmDeleteRecordFromWorkspace.bind(this)).delegateTo(document,Identifiers.removeAction),new RegularEvent("click",((e,t)=>{let n;n="true"===t.ariaExpanded?"actions-caret-down":"actions-caret-right",t.replaceChildren(document.createRange().createContextualFragment(IconHelper.getIcon(n)))})).delegateTo(document,Identifiers.expandAction),new RegularEvent("click",(()=>{window.top.document.querySelectorAll(".t3js-workspace-recipient").forEach((e=>{e.disabled||(e.checked=!0)}))})).delegateTo(window.top.document,Identifiers.workspaceRecipientsSelectAll),new RegularEvent("click",(()=>{window.top.document.querySelectorAll(".t3js-workspace-recipient").forEach((e=>{e.disabled||(e.checked=!1)}))})).delegateTo(window.top.document,Identifiers.workspaceRecipientsDeselectAll),new RegularEvent("submit",(e=>{e.preventDefault();const t=document.querySelector(Identifiers.searchTextField);this.settings.filterTxt=t.value,this.getWorkspaceInfos()})).delegateTo(document,Identifiers.searchForm),new RegularEvent("input",((e,t)=>{const n=document.querySelector(Identifiers.searchSubmitBtn);""!==t.value?n.classList.remove("disabled"):(n.classList.add("disabled"),this.getWorkspaceInfos())})).delegateTo(document,Identifiers.searchTextField);const e=document.querySelector(Identifiers.searchTextField);null!==e&&e.clearable({onClear:()=>{document.querySelector(Identifiers.searchSubmitBtn).classList.add("disabled"),this.settings.filterTxt="",this.getWorkspaceInfos()}}),new RegularEvent("multiRecordSelection:checkbox:state:changed",this.handleCheckboxStateChanged).bindTo(document),new RegularEvent("change",((e,t)=>{const n=t.value;Persistent.set("moduleData.workspaces_admin.depth",n),this.settings.depth=n,this.getWorkspaceInfos()})).delegateTo(document,Identifiers.depthSelector),new RegularEvent("click",this.generatePreviewLinks.bind(this)).delegateTo(document,Identifiers.previewLinksButton),new RegularEvent("change",((e,t)=>{Persistent.set("moduleData.workspaces_admin.language",t.value),this.settings.language=t.value,this.sendRemoteRequest(this.generateRemotePayload("getWorkspaceInfos",this.settings)).then((async e=>{const n=await e.resolve();t.previousElementSibling.innerHTML=t.querySelector("option:checked").dataset.icon,this.renderWorkspaceInfos(n[0].result)}))})).delegateTo(document,Identifiers.languageSelector),new RegularEvent("change",((e,t)=>{const n=t.value;Persistent.set("moduleData.workspaces_admin.stage",n),this.settings.stage=n,this.getWorkspaceInfos()})).delegateTo(document,Identifiers.stagesSelector),new RegularEvent("change",this.sendToSpecificStageAction.bind(this)).delegateTo(document,Identifiers.chooseStageAction),new RegularEvent("change",this.runSelectionAction.bind(this)).delegateTo(document,Identifiers.chooseSelectionAction),new RegularEvent("change",this.runMassAction.bind(this)).delegateTo(document,Identifiers.chooseMassAction),new RegularEvent("click",(e=>{e.preventDefault();const t=e.target.closest("button");let n=!1;switch(t.dataset.action){case"previous":this.paging.currentPage>1&&(this.paging.currentPage--,n=!0);break;case"next":this.paging.currentPage<this.paging.totalPages&&(this.paging.currentPage++,n=!0);break;case"page":this.paging.currentPage=parseInt(t.dataset.page,10),n=!0;break;default:throw'Unknown action "'+t.dataset.action+'"'}n&&(this.settings.start=parseInt(this.settings.limit.toString(),10)*(this.paging.currentPage-1),this.getWorkspaceInfos())})).delegateTo(document,Identifiers.pagination)}sendToStage(e,t){let n,a,s;if("next"===t)n=e.dataset.nextStage,a="sendToNextStageWindow",s="sendToNextStageExecute";else{if("prev"!==t)throw"Invalid direction given.";n=e.dataset.prevStage,a="sendToPrevStageWindow",s="sendToPrevStageExecute"}this.sendRemoteRequest(this.generateRemoteActionsPayload(a,[e.dataset.uid,e.dataset.table,e.dataset.t3ver_oid])).then((async t=>{const a=this.renderSendToStageWindow(await t.resolve());a.addEventListener("button.clicked",(t=>{if("ok"===t.target.name){const t=Utility.convertFormToObject(a.querySelector("form"));t.affects={table:e.dataset.table,nextStage:n,t3ver_oid:e.dataset.t3ver_oid,uid:e.dataset.uid,elements:[]},this.sendRemoteRequest([this.generateRemoteActionsPayload(s,[t]),this.generateRemotePayload("getWorkspaceInfos",this.settings)]).then((async e=>{const t=await e.resolve();a.hideModal(),this.renderWorkspaceInfos(t[1].result),Backend.refreshPageTree()}))}}))}))}getWorkspaceInfos(){this.sendRemoteRequest(this.generateRemotePayload("getWorkspaceInfos",this.settings)).then((async e=>{this.renderWorkspaceInfos((await e.resolve())[0].result)}))}renderWorkspaceInfos(e){const t=document.querySelector(Identifiers.contentsContainer),n=document.querySelector(Identifiers.noContentsContainer);this.resetMassActionState(e.data.length),this.buildPagination(e.total),0===e.total?(t.style.display="none",n.style.display="block"):(t.style.display="block",n.style.display="none");document.querySelector("typo3-workspaces-record-table").results=e.data}buildPagination(e){const t=document.querySelector(Identifiers.pagination);if(0===e)return void t.replaceChildren();if(this.paging.totalItems=e,this.paging.totalPages=Math.ceil(e/parseInt(this.settings.limit.toString(),10)),1===this.paging.totalPages)return void t.replaceChildren();const n=document.createElement("typo3-backend-pagination");n.paging=this.paging,t.append(n)}viewChanges(e,t){e.preventDefault();const n=t.closest("tr");this.sendRemoteRequest(this.generateRemotePayload("getRowDetails",{stage:parseInt(n.dataset.stage,10),t3ver_oid:parseInt(n.dataset.t3ver_oid,10),table:n.dataset.table,uid:parseInt(n.dataset.uid,10),filterFields:!0})).then((async e=>{const t=(await e.resolve())[0].result.data[0],a=[],s=document.createElement("typo3-workspaces-record-information");s.record=t,s.TYPO3lang=TYPO3.lang,!1!==t.label_PrevStage&&n.dataset.stage!==n.dataset.prevStage&&a.push({text:t.label_PrevStage.title,active:!0,btnClass:"btn-default",name:"prevstage",trigger:(e,t)=>{t.hideModal(),this.sendToStage(n,"prev")}}),!1!==t.label_NextStage&&a.push({text:t.label_NextStage.title,active:!0,btnClass:"btn-default",name:"nextstage",trigger:(e,t)=>{t.hideModal(),this.sendToStage(n,"next")}}),a.push({text:TYPO3.lang.close,active:!0,btnClass:"btn-info",name:"cancel",trigger:(e,t)=>t.hideModal()}),Modal.advanced({type:Modal.types.default,title:TYPO3.lang["window.recordInformation"].replace("{0}",n.querySelector(".t3js-title-workspace").innerText.trim()),content:s,severity:SeverityEnum.info,buttons:a,size:Modal.sizes.medium})}))}openPreview(e,t){const n=t.closest("tr");this.sendRemoteRequest(this.generateRemoteActionsPayload("viewSingleRecord",[n.dataset.table,n.dataset.uid])).then((async e=>{const t=(await e.resolve())[0].result;windowManager.localOpen(t)}))}confirmDeleteRecordFromWorkspace(e,t){const n=t.closest("tr"),a=Modal.confirm(TYPO3.lang["window.discard.title"],TYPO3.lang["window.discard.message"],SeverityEnum.warning,[{text:TYPO3.lang.cancel,active:!0,btnClass:"btn-default",name:"cancel",trigger:()=>{a.hideModal()}},{text:TYPO3.lang.ok,btnClass:"btn-warning",name:"ok"}]);a.addEventListener("button.clicked",(e=>{"ok"===e.target.name&&this.sendRemoteRequest([this.generateRemoteActionsPayload("deleteSingleRecord",[n.dataset.table,n.dataset.uid])]).then((()=>{a.hideModal(),this.getWorkspaceInfos(),Backend.refreshPageTree()}))}))}runSelectionAction(e,t){const n=t.value,a="discard"!==n;if(0===n.length)return;const s=[];for(let e=0;e<this.markedRecordsForMassAction.length;++e){const t=this.markedRecordsForMassAction[e].split(":");s.push({table:t[0],liveId:t[2],versionId:t[1]})}a?this.checkIntegrity({selection:s,type:"selection"}).then((async e=>{"warning"===(await e.resolve())[0].result.result?this.openIntegrityWarningModal().addEventListener("confirm.button.ok",(()=>{this.renderSelectionActionModal(n,s)})):this.renderSelectionActionModal(n,s)})):this.renderSelectionActionModal(n,s)}renderPublishModal(e){const t=Modal.advanced({title:TYPO3.lang["window.publish.title"],content:TYPO3.lang["window.publish.message"],severity:SeverityEnum.info,staticBackdrop:!0,buttons:[{text:TYPO3.lang.cancel,btnClass:"btn-default",trigger:function(){t.hideModal()}},{text:TYPO3.lang.label_doaction_publish,btnClass:"btn-info",action:new DeferredAction((async()=>{await this.sendRemoteRequest(this.generateRemoteActionsPayload("publishSingleRecord",[e.dataset.table,e.dataset.t3ver_oid,e.dataset.uid])),this.getWorkspaceInfos(),Backend.refreshPageTree()}))}]})}renderSelectionActionModal(e,t){const n=Modal.advanced({title:TYPO3.lang["window.selectionAction.title"],content:html`<p>${TYPO3.lang["tooltip."+e+"Selected"]}</p>`,severity:SeverityEnum.warning,staticBackdrop:!0,buttons:[{text:TYPO3.lang.cancel,btnClass:"btn-default",trigger:function(){n.hideModal()}},{text:TYPO3.lang["label_doaction_"+e],btnClass:"btn-warning",action:new DeferredAction((async()=>{await this.sendRemoteRequest(this.generateRemoteActionsPayload("executeSelectionAction",{action:e,selection:t})),this.markedRecordsForMassAction=[],this.getWorkspaceInfos(),Backend.refreshPageTree()}))}]});n.addEventListener("typo3-modal-hidden",(()=>{document.querySelector(Identifiers.chooseSelectionAction).value=""}))}runMassAction(e,t){const n=t.value,a="discard"!==n;0!==n.length&&(a?this.checkIntegrity({language:this.settings.language,type:n}).then((async e=>{"warning"===(await e.resolve())[0].result.result?this.openIntegrityWarningModal().addEventListener("confirm.button.ok",(()=>{this.renderMassActionModal(n)})):this.renderMassActionModal(n)})):this.renderMassActionModal(n))}renderMassActionModal(e){let t,n;switch(e){case"publish":t="publishWorkspace",n=TYPO3.lang.label_doaction_publish;break;case"discard":t="flushWorkspace",n=TYPO3.lang.label_doaction_discard;break;default:throw"Invalid mass action "+e+" called."}const a=async e=>{const n=(await e.resolve())[0].result;n.processed<n.total?this.sendRemoteRequest(this.generateRemoteMassActionsPayload(t,n)).then(a):(this.getWorkspaceInfos(),Modal.dismiss())},s=Modal.advanced({title:TYPO3.lang["window.massAction.title"],content:html`<p>${TYPO3.lang["tooltip."+e+"All"]}</p><p>${TYPO3.lang["tooltip.affectWholeWorkspace"]}</p>`,severity:SeverityEnum.warning,staticBackdrop:!0,buttons:[{text:TYPO3.lang.cancel,btnClass:"btn-default",trigger:function(){s.hideModal()}},{text:n,btnClass:"btn-warning",action:new DeferredAction((async()=>{const e=await this.sendRemoteRequest(this.generateRemoteMassActionsPayload(t,{init:!0,total:0,processed:0,language:this.settings.language}));await a(e)}))}]});s.addEventListener("typo3-modal-hidden",(()=>{document.querySelector(Identifiers.chooseMassAction).value=""}))}sendToSpecificStageAction(e,t){const n=[],a=t.value;for(let e=0;e<this.markedRecordsForMassAction.length;++e){const t=this.markedRecordsForMassAction[e].split(":");n.push({table:t[0],uid:t[1],t3ver_oid:t[2]})}this.sendRemoteRequest(this.generateRemoteActionsPayload("sendToSpecificStageWindow",[a,n])).then((async e=>{const t=this.renderSendToStageWindow(await e.resolve());t.addEventListener("button.clicked",(e=>{if("ok"===e.target.name){const e=Utility.convertFormToObject(t.querySelector("form"));e.affects={elements:n,nextStage:a},this.sendRemoteRequest([this.generateRemoteActionsPayload("sendToSpecificStageExecute",[e]),this.generateRemotePayload("getWorkspaceInfos",this.settings)]).then((async e=>{const n=await e.resolve();t.hideModal(),this.renderWorkspaceInfos(n[1].result),Backend.refreshPageTree()}))}})),t.addEventListener("typo3-modal-hide",(()=>{document.querySelector(Identifiers.chooseStageAction).value=""}))}))}generatePreviewLinks(){this.sendRemoteRequest(this.generateRemoteActionsPayload("generateWorkspacePreviewLinksForAllLanguages",[this.settings.id])).then((async e=>{const t=(await e.resolve())[0].result,n=document.createElement("dl");for(const[e,a]of Object.entries(t)){const t=document.createElement("dt");t.textContent=e;const s=document.createElement("a");s.href=a,s.target="_blank",s.textContent=a;const o=document.createElement("dd");o.appendChild(s),n.append(t,o)}Modal.show(TYPO3.lang.previewLink,n,SeverityEnum.info,[{text:TYPO3.lang.ok,active:!0,btnClass:"btn-info",name:"ok",trigger:(e,t)=>t.hideModal()}],["modal-inner-scroll"])}))}resetMassActionState(e){if(this.markedRecordsForMassAction=[],e){document.querySelector(Identifiers.workspaceActions).classList.remove("hidden");document.querySelector(Identifiers.chooseMassAction).disabled=!1}document.dispatchEvent(new CustomEvent("multiRecordSelection:actions:hide"))}}export default new Backend;