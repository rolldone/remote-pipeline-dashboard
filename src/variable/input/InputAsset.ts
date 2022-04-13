import BaseRactive from "base/BaseRactive";
import InputText from "./InputText";

export default InputText.extend({
  template: /* html */`
  <div class="row align-items-top">
    <div class="col-auto">
      <input type="checkbox" class="form-check-input">
    </div>
    <div class="col-auto">
      <select type="text" class="form-select tomselected ts-hidden-accessible" placeholder="Select a date" id="select-users" value="" tabindex="-1">
        <option value="3">Paweł Kuna</option>
        <option value="4">Nikola Tesla</option>
        <option value="1">Chuck Tesla</option>
        <option value=""></option>
        <option value="2">Elon Musk</option>
      </select>
    </div>
    <div class="col text-truncate">
      <input type="text" class="form-control" name="example-text-input" placeholder="Input var name">
      <br/>
      <div class="mb-3">
        <div class="row">
          <div class="col">
            <input type="file" class="form-control">
          </div>
          <div class="col-auto">
            <a href="#" class="btn btn-facebook w-100 btn-icon" aria-label="Facebook">
              <!-- Download SVG icon from http://tabler-icons.io/i/brand-facebook -->
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"></path></svg>
            </a>
          </div>
        </div>
      </div>
      <div class="mb-3">
        <div class="row">
          <div class="col">
            <input type="file" class="form-control">
          </div>
          <div class="col-auto">
            <a href="#" class="btn btn-facebook w-100 btn-icon" aria-label="Facebook">
              <!-- Download SVG icon from http://tabler-icons.io/i/brand-facebook -->
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"></path></svg>
            </a>
          </div>
        </div>
      </div>
      <div class="mb-3">
        <div class="row">
          <div class="col">
            <input type="file" class="form-control">
          </div>
          <div class="col-auto">
            <a href="#" class="btn btn-facebook w-100 btn-icon" aria-label="Facebook">
              <!-- Download SVG icon from http://tabler-icons.io/i/brand-facebook -->
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})