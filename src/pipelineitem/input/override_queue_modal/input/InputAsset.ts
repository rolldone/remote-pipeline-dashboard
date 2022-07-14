import VariableInputAsset, { InputAssetInterface } from "variable/input/InputAsset";

const InputAsset = VariableInputAsset.extend<InputAssetInterface>({
//   template: /* html */`
//   <div class="row align-items-top">
//     <div class="col text-truncate">
//       <input type="text" class="form-control" name="name" value="{{form_scheme.name}}" placeholder="Input var name">
//       <br/>
//       {{#form_scheme.attachment_datas:i}}
//       <div class="mb-3">
//         <div class="row">
//           <div class="col">
//             <input type="file" style="display:none" value="{{form_data.attachment_datas[i].file}}" name="attatchment-{{i}}" class="form-control" placeholder="{{form_data.attachment_datas.file[0].name}}">
//             <input type="text" class="form-control" value="{{form_data.attachment_datas[i].file[0].name}}" on-click="@this.handleClick('CHOOSE_FILE',{ name : 'attatchment-'+i },@event)" placeholder="Choose a file" readonly="readyonly">
//           </div>
//           <div class="col-auto">
//             {{#if (form_scheme.attachment_datas.length - 1) == i}}
//             <a href="#" class="btn btn-facebook w-100 btn-icon" aria-label="Facebook" on-click="@this.handleClick('MOREE_UPLOAD',{},@event)">
//               <!-- Download SVG icon from http://tabler-icons.io/i/brand-facebook -->
//               <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-plus" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
//                 <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
//                 <line x1="12" y1="5" x2="12" y2="19"></line>
//                 <line x1="5" y1="12" x2="19" y2="12"></line>
//               </svg>
//             </a>
//             {{else}}
//             <a href="#" class="btn btn-facebook w-100 btn-icon" aria-label="Facebook" on-click="@this.handleClick('DELETE_FILE',{ index : i },@event)">
//               <!-- Download SVG icon from http://tabler-icons.io/i/brand-facebook -->
//               <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-minus" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
//                 <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
//                 <line x1="5" y1="12" x2="19" y2="12"></line>
//               </svg>
//             </a>
//             {{/if}}
//           </div>
//         </div>
//       </div>
//       {{/form_scheme.attachment_datas}}
//       {{#if form_scheme.attachment_datas.length > 0}}
//       <div class="mb-3">
//         <div class="row">
//           <div class="col-1">
//             <a href="#" class="btn btn-blue w-100" on-click="@this.handleClick('SUBMIT_FILE',{},@event)">
//               Uploads
//             </a>
//           </div>
//         </div>
//       </div>
//       {{/if}}
//     </div>
//   </div>
// `,
});

export default InputAsset