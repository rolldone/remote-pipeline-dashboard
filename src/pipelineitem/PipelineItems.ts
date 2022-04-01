import BaseRactive from "base/BaseRactive";
import BasicCommand from "./input/BasicCommand";
import ConditionalCommand from "./input/ConditionalCommand";
import template from './PipelineItemsView.html';

export default BaseRactive.extend({
  template,
  components: {
    "basic-command": BasicCommand,
    "conditional-command": ConditionalCommand
  }
});