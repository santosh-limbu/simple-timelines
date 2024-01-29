import { ItemView, WorkspaceLeaf, } from "obsidian";

export const TIMELINE_VIEW = "timeline-view";

export class TimelineView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return TIMELINE_VIEW;
  }

  getDisplayText() {
    return "Timeline View";
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.createEl("h4", { text: "Timeline" });
  }



  
  async onClose() {
    // Nothing to clean up.
  }
}