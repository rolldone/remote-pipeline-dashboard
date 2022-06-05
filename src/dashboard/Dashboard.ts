import BaseRactive, { BaseRactiveInterface } from "../base/BaseRactive";
import template from './dashboardView.html';
import QueueRecordDetails from "./display_queue_details/QueueRecordDetails";
import RowCard from "./row_card/RowCard";
import SelectPeriods from "./select_periods/SelectPeriods";

export interface DashboardInterface extends BaseRactiveInterface {
  getStatDatas: { (): void }
  setStatDatas: { (props: any): void }
  getQueueRecordDetails: { (): void }
  setQueueRecordDetails: { (props: any): void }

}

export default BaseRactive.extend<DashboardInterface>({
  template,
  components: {
    "select-periods": SelectPeriods,
    "row-cards": RowCard,
    "queue-record-details": QueueRecordDetails
  },
  onconstruct() {
    this.newOn = {
      onSelectPeriodsListener: (c, action, text, e) => {
        switch (action) {
          case 'SELECT':

            break;
        }
      },
      onRowCardsListener: (c, action, text, e) => {

      },
      onQueueRecordDetailsListener: (c, action, text, e) => {

      }
    }
    this._super();
  },
  data() {
    return {

    }
  },
  getStatDatas() {
    try { } catch (ex) { }
  },
  setStatDatas(props) {
    if (props == null) return;
  },
  getQueueRecordDetails() {
    try { } catch (ex) { }
  },
  setQueueRecordDetails(props) {
    if (props == null) return;
  }
});