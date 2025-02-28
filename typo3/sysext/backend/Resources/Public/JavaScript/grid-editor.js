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
var GridEditor_1,SlideModes,__decorate=function(t,e,o,i){var r,n=arguments.length,d=n<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)d=Reflect.decorate(t,e,o,i);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(d=(n<3?r(d):n>3?r(e,o,d):r(e,o))||d);return n>3&&d&&Object.defineProperty(e,o,d),d};import{SeverityEnum}from"@typo3/backend/enum/severity.js";import"bootstrap";import{default as Modal}from"@typo3/backend/modal.js";import SecurityUtility from"@typo3/core/security-utility.js";import{customElement,property}from"lit/decorators.js";import{html,LitElement,nothing}from"lit";import{classMap}from"lit/directives/class-map.js";import{styleMap}from"lit/directives/style-map.js";import{ref,createRef}from"lit/directives/ref.js";import{CodeMirrorElement}from"@typo3/backend/code-editor/element/code-mirror-element.js";!function(t){t.none="",t.slide="slide",t.collect="collect",t.collectReverse="collectReverse"}(SlideModes||(SlideModes={}));let GridEditor=GridEditor_1=class extends LitElement{constructor(){super(...arguments),this.colCount=1,this.rowCount=1,this.readOnly=!1,this.fieldName="",this.data=[],this.codeMirrorConfig={},this.previewAreaRef=createRef(),this.codeMirrorRef=createRef(),this.defaultCell={spanned:0,rowspan:1,colspan:1,name:"",colpos:"",column:void 0,identifier:"",slideMode:SlideModes.none},this.modalButtonClickHandler=t=>{const e=t.target,o=t.currentTarget;"cancel"===e.name?o.hideModal():"ok"===e.name&&(this.setName(o.querySelector(".t3js-grideditor-field-name").value,o.userData.col,o.userData.row),this.setColumn(parseInt(o.querySelector(".t3js-grideditor-field-colpos").value,10),o.userData.col,o.userData.row),this.setIdentifier(o.querySelector(".t3js-grideditor-field-identifier").value,o.userData.col,o.userData.row),this.setSlideMode(o.querySelector(".t3js-grideditor-field-slide-mode").value,o.userData.col,o.userData.row),this.requestUpdate(),this.writeConfig(this.export2LayoutRecord()),o.hideModal())},this.addColumnHandler=t=>{t.preventDefault(),this.addColumn(),this.requestUpdate(),this.writeConfig(this.export2LayoutRecord())},this.removeColumnHandler=t=>{t.preventDefault(),this.removeColumn(),this.requestUpdate(),this.writeConfig(this.export2LayoutRecord())},this.addRowTopHandler=t=>{t.preventDefault(),this.addRowTop(),this.requestUpdate(),this.writeConfig(this.export2LayoutRecord())},this.addRowBottomHandler=t=>{t.preventDefault(),this.addRowBottom(),this.requestUpdate(),this.writeConfig(this.export2LayoutRecord())},this.removeRowTopHandler=t=>{t.preventDefault(),this.removeRowTop(),this.requestUpdate(),this.writeConfig(this.export2LayoutRecord())},this.removeRowBottomHandler=t=>{t.preventDefault(),this.removeRowBottom(),this.requestUpdate(),this.writeConfig(this.export2LayoutRecord())},this.linkEditorHandler=t=>{t.preventDefault();const e=t.currentTarget;this.showOptions(Number(e.dataset.col),Number(e.dataset.row))},this.linkExpandRightHandler=t=>{t.preventDefault();const e=t.currentTarget;this.addColspan(Number(e.dataset.col),Number(e.dataset.row)),this.requestUpdate(),this.writeConfig(this.export2LayoutRecord())},this.linkShrinkLeftHandler=t=>{t.preventDefault();const e=t.currentTarget;this.removeColspan(Number(e.dataset.col),Number(e.dataset.row)),this.requestUpdate(),this.writeConfig(this.export2LayoutRecord())},this.linkExpandDownHandler=t=>{t.preventDefault();const e=t.currentTarget;this.addRowspan(Number(e.dataset.col),Number(e.dataset.row)),this.requestUpdate(),this.writeConfig(this.export2LayoutRecord())},this.linkShrinkUpHandler=t=>{t.preventDefault();const e=t.currentTarget;this.removeRowspan(Number(e.dataset.col),Number(e.dataset.row)),this.requestUpdate(),this.writeConfig(this.export2LayoutRecord())}}static stripMarkup(t){return(new SecurityUtility).stripHtml(t)}connectedCallback(){this.field=document.querySelector('input[name="'+this.fieldName+'"]'),this.addVisibilityObserver(this),super.connectedCallback()}firstUpdated(){this.writeConfig(this.export2LayoutRecord())}createRenderRoot(){return this}render(){return html`
      <div class=${classMap({grideditor:!0,"grideditor-readonly":this.readOnly})}>
        ${this.readOnly?nothing:this.renderControls("top",!1)}
        <div class="grideditor-editor">
          <div class="t3js-grideditor">
            ${this.renderEditorGrid()}
          </div>
        </div>
        ${this.readOnly?nothing:this.renderControls("right",!0)}
        ${this.readOnly?nothing:this.renderControls("bottom",!1)}
        <div class="grideditor-preview">
          ${this.renderPreview()}
        </div>
      </div>
    `}renderControls(t,e){const o={top:this.addRowTopHandler,right:this.addColumnHandler,bottom:this.addRowBottomHandler},i={top:TYPO3.lang.grid_addRow,right:TYPO3.lang.grid_addColumn,bottom:TYPO3.lang.grid_addRow},r={top:this.removeRowTopHandler,right:this.removeColumnHandler,bottom:this.removeRowBottomHandler},n={top:TYPO3.lang.grid_removeRow,right:TYPO3.lang.grid_removeColumn,bottom:TYPO3.lang.grid_removeRow};return html`
      <div class="grideditor-control grideditor-control-${t}">
        <div class=${classMap({"btn-group":!e,"btn-group-vertical":e})}>
          <button @click=${o[t]} class="btn btn-default btn-sm" title=${i[t]}>
            <typo3-backend-icon identifier="actions-plus" size="small"></typo3-backend-icon>
          </button>
          <button @click=${r[t]} class="btn btn-default btn-sm" title=${n[t]}>
            <typo3-backend-icon identifier="actions-minus" size="small"></typo3-backend-icon>
          </button>
        </div>
      </div>
    `}renderEditorGrid(){const t=[];for(let e=0;e<this.rowCount;e++){if(0!==this.data[e].length)for(let o=0;o<this.colCount;o++){const i=this.data[e][o];1!==i.spanned&&t.push(this.renderGridCell(e,o,i))}}return html`
      <div class="grideditor-editor-grid">
        ${t}
      </div>
    `}renderGridCell(t,e,o){const i={"--grideditor-cell-col":e+1,"--grideditor-cell-colspan":o.colspan,"--grideditor-cell-row":t+1,"--grideditor-cell-rowspan":o.rowspan};return html`
      <div class="grideditor-cell" style=${styleMap(i)}>
        <div class="grideditor-cell-actions">
        ${this.readOnly?nothing:html`
            <button
              @click=${this.linkEditorHandler}
              class="t3js-grideditor-link-editor grideditor-action grideditor-action-edit"
              data-row=${t}
              data-col=${e}
              title=${TYPO3.lang.grid_editCell}>
              <typo3-backend-icon identifier="actions-open" size="small"></typo3-backend-icon>
            </button>
            ${this.cellCanSpanRight(e,t)?html`
                <button
                  @click=${this.linkExpandRightHandler}
                  class="t3js-grideditor-link-expand-right grideditor-action grideditor-action-expand-right"
                  data-row=${t}
                  data-col=${e}
                  title=${TYPO3.lang.grid_cell_merge_right}>
                  <typo3-backend-icon identifier="actions-caret-right" size="small"></typo3-backend-icon>
                </button>
              `:nothing}
            ${this.cellCanShrinkLeft(e,t)?html`
                <button
                  @click=${this.linkShrinkLeftHandler}
                  class="t3js-grideditor-link-shrink-left grideditor-action grideditor-action-shrink-left"
                  data-row=${t}
                  data-col=${e}
                  title=${TYPO3.lang.grid_cell_split_horizontal}>
                  <typo3-backend-icon identifier="actions-caret-left" size="small"></typo3-backend-icon>
                </button>
              `:nothing}
            ${this.cellCanSpanDown(e,t)?html`
                <button
                  @click=${this.linkExpandDownHandler}
                  class="t3js-grideditor-link-expand-down grideditor-action grideditor-action-expand-down"
                  data-row=${t}
                  data-col=${e}
                  title=${TYPO3.lang.grid_cell_merge_down}>
                  <typo3-backend-icon identifier="actions-caret-down" size="small"></typo3-backend-icon>
                </button>
              `:nothing}
            ${this.cellCanShrinkUp(e,t)?html`
                <button
                  @click=${this.linkShrinkUpHandler}
                  class="t3js-grideditor-link-shrink-up grideditor-action grideditor-action-shrink-up"
                  data-row=${t}
                  data-col=${e}
                  title=${TYPO3.lang.grid_cell_split_vertical}>
                  <typo3-backend-icon identifier="actions-caret-up" size="small"></typo3-backend-icon>
                </button>
              `:nothing}
          `}
        </div>

        <div class="grideditor-cell-info">
          <strong>${TYPO3.lang.grid_name}:</strong>
          ${o.name?GridEditor_1.stripMarkup(o.name):TYPO3.lang.grid_notSet}
          <br/>
          <strong>${TYPO3.lang.grid_column}:</strong>
          ${void 0===o.column||isNaN(o.column)?TYPO3.lang.grid_notSet:o.column}
          ${o.identifier?.length?html`<br/><strong>${TYPO3.lang.grid_identifier}:</strong> ${o.identifier}`:""}
          ${""!==(o.slideMode?.toString()||"")?html`<br/><strong>${TYPO3.lang.grid_slideMode}:</strong> ${o.slideMode.toString()}`:""}
        </div>
      </div>
    `}renderPreview(){return 0===Object.keys(this.codeMirrorConfig).length?html`
        <label>${TYPO3.lang["buttons.pageTsConfig"]}</label>
        <div class="t3js-grideditor-preview-config grideditor-preview">
            <textarea class="t3js-tsconfig-preview-area form-control" rows="25" readonly ${ref(this.previewAreaRef)}></textarea>
        </div>
      `:html`
      <typo3-t3editor-codemirror
        class="t3js-grideditor-preview-config grideditor-preview"
        label=${this.codeMirrorConfig.label}
        panel=${this.codeMirrorConfig.panel}
        mode=${this.codeMirrorConfig.mode}
        nolazyload=true
        readonly=true
        ${ref(this.codeMirrorRef)}>
        <textarea class="t3js-tsconfig-preview-area form-control" ${ref(this.previewAreaRef)}></textarea>
      </typo3-t3editor-codemirror>
    `}getNewCell(){return structuredClone(this.defaultCell)}writeConfig(t){this.field.value=t;const e=t.split("\n");let o="";for(const t of e)t&&(o+="\t\t\t"+t+"\n");const i="mod.web_layout.BackendLayouts {\n  exampleKey {\n    title = Example\n    icon = content-container-columns-2\n    config {\n"+o.replace(new RegExp("\\t","g"),"  ")+"    }\n  }\n}\n",r=this.previewAreaRef.value;r instanceof HTMLTextAreaElement&&(r.value=i);const n=this.codeMirrorRef.value;n instanceof CodeMirrorElement&&n.setContent(i)}addRowTop(){const t=[];for(let e=0;e<this.colCount;e++){const o=this.getNewCell();o.name=e+"x"+this.data.length,t[e]=o}this.data.unshift(t),this.rowCount++}addRowBottom(){const t=[];for(let e=0;e<this.colCount;e++){const o=this.getNewCell();o.name=e+"x"+this.data.length,t[e]=o}this.data.push(t),this.rowCount++}removeRowTop(){if(this.rowCount<=1)return!1;const t=[];for(let e=1;e<this.rowCount;e++)t.push(this.data[e]);for(let t=0;t<this.colCount;t++)1===this.data[0][t].spanned&&this.findUpperCellWidthRowspanAndDecreaseByOne(t,0);return this.data=t,this.rowCount--,!0}removeRowBottom(){if(this.rowCount<=1)return!1;const t=[];for(let e=0;e<this.rowCount-1;e++)t.push(this.data[e]);for(let t=0;t<this.colCount;t++)1===this.data[this.rowCount-1][t].spanned&&this.findUpperCellWidthRowspanAndDecreaseByOne(t,this.rowCount-1);return this.data=t,this.rowCount--,!0}findUpperCellWidthRowspanAndDecreaseByOne(t,e){const o=this.getCell(t,e-1);return!!o&&(1===o.spanned?this.findUpperCellWidthRowspanAndDecreaseByOne(t,e-1):o.rowspan>1&&this.removeRowspan(t,e-1),!0)}removeColumn(){if(this.colCount<=1)return!1;const t=[];for(let e=0;e<this.rowCount;e++){const o=[];for(let t=0;t<this.colCount-1;t++)o.push(this.data[e][t]);1===this.data[e][this.colCount-1].spanned&&this.findLeftCellWidthColspanAndDecreaseByOne(this.colCount-1,e),t.push(o)}return this.data=t,this.colCount--,!0}findLeftCellWidthColspanAndDecreaseByOne(t,e){const o=this.getCell(t-1,e);return!!o&&(1===o.spanned?this.findLeftCellWidthColspanAndDecreaseByOne(t-1,e):o.colspan>1&&this.removeColspan(t-1,e),!0)}addColumn(){for(let t=0;t<this.rowCount;t++){const e=this.getNewCell();e.name=this.colCount+"x"+t,this.data[t].push(e)}this.colCount++}setName(t,e,o){const i=this.getCell(e,o);return!!i&&(i.name=GridEditor_1.stripMarkup(t),!0)}setColumn(t,e,o){const i=this.getCell(e,o);return!!i&&(i.column=parseInt(t.toString(),10),!0)}setIdentifier(t,e,o){const i=this.getCell(e,o);return!!i&&(i.identifier=GridEditor_1.stripMarkup(t),!0)}setSlideMode(t,e,o){const i=this.getCell(e,o);return!!i&&(i.slideMode=SlideModes[t],!0)}showOptions(t,e){const o=this.getCell(t,e);if(!o)return!1;let i;i=0===o.column?0:o.column?parseInt(o.column.toString(),10):"";const r=document.createElement("div"),n=document.createElement("div");n.classList.add("form-group");const d=document.createElement("label");d.classList.add("form-label");const s=document.createElement("input");s.classList.add("form-control");const l=n.cloneNode(!0),a=d.cloneNode(!0);a.innerText=TYPO3.lang.grid_nameHelp,a.htmlFor="grideditor-field-name";const c=s.cloneNode(!0);c.id="grideditor-field-name",c.type="text",c.classList.add("t3js-grideditor-field-name"),c.name="name",c.value=GridEditor_1.stripMarkup(o.name)||"",l.append(a,c);const p=n.cloneNode(!0),h=d.cloneNode(!0);h.innerText=TYPO3.lang.grid_columnHelp,h.htmlFor="grideditor-field-colpos";const u=s.cloneNode(!0);u.type="text",u.classList.add("t3js-grideditor-field-colpos"),u.id="grideditor-field-colpos",u.name="column",u.value=i.toString(),p.append(h,u);const g=n.cloneNode(!0),m=d.cloneNode(!0);m.innerText=TYPO3.lang.grid_identifierHelp,m.htmlFor="grideditor-field-identifier";const f=s.cloneNode(!0);c.type="text",f.classList.add("t3js-grideditor-field-identifier"),f.id="grideditor-field-identifier",f.name="identifier",f.value="string"==typeof o.identifier?GridEditor_1.stripMarkup(o.identifier):"",g.append(m,f);const C=n.cloneNode(!0),w=d.cloneNode(!0);w.innerText=TYPO3.lang.grid_slideModeHelp,w.htmlFor="grideditor-field-slide-mode";const v=document.createElement("select");v.classList.add("form-select","t3js-grideditor-field-slide-mode"),v.id="grideditor-field-slide-mode",v.name="slideMode",v.value=GridEditor_1.stripMarkup(o.slideMode?.toString())||"",Object.keys(SlideModes).map((t=>{const e="none"!==t?t:"",i=SlideModes[t],r=document.createElement("option");r.value=i,r.text=e,r.selected=i===o.slideMode?.toString(),v.appendChild(r)})),C.append(w,v),r.append(l,p,g,C);const y=Modal.show(TYPO3.lang.grid_windowTitle,r,SeverityEnum.notice,[{active:!0,btnClass:"btn-default",name:"cancel",text:TYPO3.lang["button.cancel"]||"Cancel"},{btnClass:"btn-primary",name:"ok",text:TYPO3.lang["button.ok"]||"OK"}]);return y.userData.col=t,y.userData.row=e,y.addEventListener("button.clicked",this.modalButtonClickHandler),!0}getCell(t,e){return!(t>this.colCount-1)&&(!(e>this.rowCount-1)&&(this.data.length>e-1&&this.data[e].length>t-1?this.data[e][t]:null))}cellCanSpanRight(t,e){if(t===this.colCount-1)return!1;const o=this.getCell(t,e);if(!o)return!1;let i;if(o.rowspan>1){for(let r=e;r<e+o.rowspan;r++)if(i=this.getCell(t+o.colspan,r),!i||1===i.spanned||i.colspan>1||i.rowspan>1)return!1}else if(i=this.getCell(t+o.colspan,e),!i||1===o.spanned||1===i.spanned||i.colspan>1||i.rowspan>1)return!1;return!0}cellCanSpanDown(t,e){if(e===this.rowCount-1)return!1;const o=this.getCell(t,e);if(!o)return!1;let i;if(o.colspan>1){for(let r=t;r<t+o.colspan;r++)if(i=this.getCell(r,e+o.rowspan),!i||1===i.spanned||i.colspan>1||i.rowspan>1)return!1}else if(i=this.getCell(t,e+o.rowspan),!i||1===o.spanned||1===i.spanned||i.colspan>1||i.rowspan>1)return!1;return!0}cellCanShrinkLeft(t,e){return this.data[e][t].colspan>1}cellCanShrinkUp(t,e){return this.data[e][t].rowspan>1}addColspan(t,e){const o=this.getCell(t,e);if(!o||!this.cellCanSpanRight(t,e))return!1;for(let i=e;i<e+o.rowspan;i++)this.data[i][t+o.colspan].spanned=1;return o.colspan+=1,!0}addRowspan(t,e){const o=this.getCell(t,e);if(!o||!this.cellCanSpanDown(t,e))return!1;for(let i=t;i<t+o.colspan;i++)this.data[e+o.rowspan][i].spanned=1;return o.rowspan+=1,!0}removeColspan(t,e){const o=this.getCell(t,e);if(!o||!this.cellCanShrinkLeft(t,e))return!1;o.colspan-=1;for(let i=e;i<e+o.rowspan;i++)this.data[i][t+o.colspan].spanned=0;return!0}removeRowspan(t,e){const o=this.getCell(t,e);if(!o||!this.cellCanShrinkUp(t,e))return!1;o.rowspan-=1;for(let i=t;i<t+o.colspan;i++)this.data[e+o.rowspan][i].spanned=0;return!0}export2LayoutRecord(){let t="backend_layout {\n\tcolCount = "+this.colCount+"\n\trowCount = "+this.rowCount+"\n\trows {\n";for(let e=0;e<this.rowCount;e++){t+="\t\t"+(e+1)+" {\n",t+="\t\t\tcolumns {\n";let o=0;for(let i=0;i<this.colCount;i++){const r=this.getCell(i,e);if(r&&!r.spanned){const n=GridEditor_1.stripMarkup(r.name)||"";o++,t+="\t\t\t\t"+o+" {\n",t+="\t\t\t\t\tname = "+(n||i+"x"+e)+"\n",r.colspan>1&&(t+="\t\t\t\t\tcolspan = "+r.colspan+"\n"),r.rowspan>1&&(t+="\t\t\t\t\trowspan = "+r.rowspan+"\n"),"number"==typeof r.column&&(t+="\t\t\t\t\tcolPos = "+r.column+"\n"),"string"==typeof r.identifier&&r.identifier.length&&(t+="\t\t\t\t\tidentifier = "+r.identifier+"\n"),void 0!==r.slideMode&&r.slideMode!==SlideModes.none&&(t+="\t\t\t\t\tslideMode = "+r.slideMode.toString()+"\n"),t+="\t\t\t\t}\n"}}t+="\t\t\t}\n",t+="\t\t}\n"}return t+="\t}\n}\n",t}addVisibilityObserver(t){null===t.offsetParent&&new IntersectionObserver((t=>{t.forEach((t=>{const e=this.codeMirrorRef.value;t.intersectionRatio>0&&e instanceof CodeMirrorElement&&e.requestUpdate()}))})).observe(t)}};__decorate([property({type:Number})],GridEditor.prototype,"colCount",void 0),__decorate([property({type:Number})],GridEditor.prototype,"rowCount",void 0),__decorate([property({type:Boolean})],GridEditor.prototype,"readOnly",void 0),__decorate([property({type:String})],GridEditor.prototype,"fieldName",void 0),__decorate([property({type:Array})],GridEditor.prototype,"data",void 0),__decorate([property({type:Object})],GridEditor.prototype,"codeMirrorConfig",void 0),GridEditor=GridEditor_1=__decorate([customElement("typo3-backend-grid-editor")],GridEditor);export{GridEditor};