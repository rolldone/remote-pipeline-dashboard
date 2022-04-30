import BaseRactive, { BaseRactiveInterface } from "base/BaseRactive";

export interface QueueSchedulerInterface extends BaseRactiveInterface {
  show?: { (props: any): void }
  hide?: { (): void }
  submitNewQueueSchedule?: { (): Promise<any> }
}

export default BaseRactive.extend<QueueSchedulerInterface>({
  template: /* html */`
  <div class="modal modal-blur fade show" id="{{id_element}}" tabindex="-1" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">New Scheduler</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <label class="form-label">Time Schedule Option</label>
          <div class="form-selectgroup-boxes row mb-3">
            <div class="col-lg-6">
              <label class="form-selectgroup-item">
                <input type="radio" name="{{form_data.schedule_type}}" value="one_time_schedule" class="form-selectgroup-input" checked="">
                <span class="form-selectgroup-label d-flex align-items-center p-3">
                  <span class="me-3">
                    <span class="form-selectgroup-check"></span>
                  </span>
                  <span class="form-selectgroup-label-content">
                    <span class="form-selectgroup-title strong mb-1">One time schedule</span>
                    <span class="d-block text-muted">Provide only basic data needed for the report</span>
                  </span>
                </span>
              </label>
            </div>
            <div class="col-lg-6">
              <label class="form-selectgroup-item">
                <input type="radio" name="{{form_data.schedule_type}}" value="repeatable" class="form-selectgroup-input">
                <span class="form-selectgroup-label d-flex align-items-center p-3">
                  <span class="me-3">
                    <span class="form-selectgroup-check"></span>
                  </span>
                  <span class="form-selectgroup-label-content">
                    <span class="form-selectgroup-title strong mb-1">Repeatable</span>
                    <span class="d-block text-muted">Insert charts and additional advanced analyses to be inserted in the report</span>
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>
        {{#if form_data.schedule_type == "repeatable"}}
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Input Minutes</label>
            <div class="input-group">
              <button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                More
              </button>
              <div class="dropdown-menu" style="">
                <a class="dropdown-item" href="#">
                  Every Minute
                </a>
                <a class="dropdown-item" href="#">
                  Even Minutes
                </a>
                <a class="dropdown-item" href="#">
                  Odd Minutes
                </a>
                <a class="dropdown-item" href="#">
                  Every 5 Minutes
                </a>
                <a class="dropdown-item" href="#">
                  Every 15 Minutes
                </a>
                <a class="dropdown-item" href="#">
                  Every 30 Minutes
                </a>
              </div>
              <input type="number" class="form-control" aria-label="Text input with dropdown button" name="minute" value="{{form_data.minute}}">
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Input Hours</label>
            <div class="input-group">
              <button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                More
              </button>
              <div class="dropdown-menu" style="">
                <a class="dropdown-item" href="#">
                  Every Hour
                </a>
                <a class="dropdown-item" href="#">
                  Even Hours
                </a>
                <a class="dropdown-item" href="#">
                  Odd Hours
                </a>
                <a class="dropdown-item" href="#">
                  Every 6 Hours
                </a>
                <a class="dropdown-item" href="#">
                  Every 12 Hours
                </a>
              </div>
              <input type="number" class="form-control" aria-label="Text input with dropdown button" name="hour" value="{{form_data.hour}}">
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Input Days</label>
            <div class="input-group">
              <button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                More
              </button>
              <div class="dropdown-menu" style="">
                <a class="dropdown-item" href="#">
                  Every Day
                </a>
                <a class="dropdown-item" href="#">
                  Even Days
                </a>
                <a class="dropdown-item" href="#">
                  Odd Days
                </a>
                <a class="dropdown-item" href="#">
                  Every 5 Days
                </a>
                <a class="dropdown-item" href="#">
                  Every 10 Days
                </a>
                <a class="dropdown-item" href="#">
                  Every half month
                </a>
              </div>
              <input type="number" class="form-control" aria-label="Text input with dropdown button" name="day" value="{{form_data.day}}">
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Input Months</label>
            <div class="input-group">
              <button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                More
              </button>
              <div class="dropdown-menu" style="">
                <a class="dropdown-item" href="#">
                  Every Month
                </a>
                <a class="dropdown-item" href="#">
                  Even Months
                </a>
                <a class="dropdown-item" href="#">
                  Odd Months
                </a>
                <a class="dropdown-item" href="#">
                  Every 4 Months
                </a>
                <a class="dropdown-item" href="#">
                  Every half year
                </a>
              </div>
              <input type="number" class="form-control" aria-label="Text input with dropdown button" name="month" value="{{form_data.month}}">
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Input Weekday</label>
            <div class="input-group">
              <button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                More
              </button>
              <div class="dropdown-menu" style="">
                <a class="dropdown-item" href="#">
                  Every Weekday
                </a>
                <a class="dropdown-item" href="#">
                  Monday-Friday
                </a>
                <a class="dropdown-item" href="#">
                  Weekend Days
                </a>
              </div>
              <input type="number" class="form-control" aria-label="Text input with dropdown button" name="weekday" value="{{form_data.weekday}}">
            </div>
          </div>
        </div>
        {{elseif form_data.schedule_type == "one_time_schedule"}}
        <div class="modal-body">
          <div class="row">
            <div class="col-lg-6">
              <div class="mb-3">
                <label class="form-label">Select Time</label>
                <input type="time" name="time" class="form-control" value="{{form_data.time}}">
              </div>
            </div>
            <div class="col-lg-6">
              <div class="mb-3">
                <label class="form-label">Select Date</label>
                <input type="date" name="date" class="form-control" value="{{form_data.date}}">
              </div>
            </div>
            <div class="col-lg-12">
              <div>
                <label class="form-label">Additional information</label>
                <textarea class="form-control" rows="3"></textarea>
              </div>
            </div>
          </div>
        </div>
        {{/if}}
        <div class="modal-footer">
          <a href="#" class="btn btn-link link-secondary" data-bs-dismiss="modal">
            Cancel
          </a>
          <a href="#" class="btn btn-primary ms-auto" data-bs-dismiss="modal" on-click="@this.handleClick('SUBMIT',{},@event)">
            <!-- Download SVG icon from http://tabler-icons.io/i/plus -->
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Create new schedule
          </a>
        </div>
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      id_element: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      form_data: {}
    }
  },
  handleClick(action, props, e) {
    switch (action) {
      case 'SUBMIT':
        e.preventDefault();
        let form_data = this.get("form_data");
        this.fire("listener", action, form_data, e);
        break;
    }
  },
  show(props) {
    this.set("form_data", {
      ...props,
      execution_id: props.execution_id,
      status: props.status
    });
    let _id_element = this.get("id_element");
    var myModal = new window.bootstrap.Modal(document.getElementById(_id_element), {
      keyboard: false
    });
    myModal.show();
  },
  hide() {
    let _id_element = this.get("id_element");
    var myModal = new window.bootstrap.Modal(document.getElementById(_id_element), {
      keyboard: false
    });
    myModal.hide();
  },
  async submitNewQueueSchedule() {
    try {

    } catch (ex) {
      console.error("submitNewQueueSchedule - ex :: ", ex);
    }
  }
});