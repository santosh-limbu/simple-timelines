import { ItemView, WorkspaceLeaf, TFile} from 'obsidian';
import TimelinePlugin from './main';
import { text } from 'stream/consumers';

export const TIMELINE_VIEW = 'timeline-view';

export class TimelineView extends ItemView {
  plugin: TimelinePlugin;

  constructor(leaf: WorkspaceLeaf, plugin: TimelinePlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() {
    return TIMELINE_VIEW;
  }

  getDisplayText() {
    return 'Timeline View';
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    
    const filterContainer = container.createEl('div', {cls: 'timeline-header'});
    filterContainer.setText("Test Timeline");

    const listContainer = container.createEl('ul');
  
    // Fetch all files with the "#timeline" tag
    const taggedFiles = await this.fetchTaggedFiles(this.plugin.settings.searchTag);
  
    // Create list items for each tagged file
    taggedFiles.forEach((file: TFile) => {
      this.createCardItem(listContainer, file);
    });
  }
  
  async fetchTaggedFiles(tag: string): Promise<TFile[]> {
    const files = this.app.vault.getFiles();
    const taggedFiles: TFile[] = [];
  
    for (const file of files) {
      if (file instanceof TFile) {
        const content = await this.app.vault.read(file);
        const tagRegex = new RegExp(`#${tag}\\b`, 'g');
        if (tagRegex.test(content)) {
          taggedFiles.push(file);
        }
      }
    }
  
    return taggedFiles;
  }

  // Create a list item for each tagged file.
  createCardItem(container: HTMLElement, file: TFile) {
    // Create a new div element for the card
    const cardItem = container.createEl('div', { cls: 'timeline-card' });
  
    // Create a div or span for the date and another for the title
    const dateEl = cardItem.createEl('div', { cls: 'timeline-date', text: 'Date Here' });
    const titleEl = cardItem.createEl('div', { cls: 'timeline-title', text: file.basename });
    // Create a button for the dropdown
    const dropdownButton = cardItem.createEl('button', { cls: 'dropdown-button' });
    dropdownButton.setText('▼'); // Set text or icon for dropdown button

    // Add event listener to the button to toggle the note content on click
    dropdownButton.addEventListener('click', async () => {
      // Toggle visibility of the note content
      const isDisplayed = noteContentEl.style.display !== 'none';
      
      // If content is not displayed, fetch and display it
      if (!isDisplayed) {
        if (!dropdownButton.classList.contains('is-loaded')) {
          // Fetch the content of the file
          let content = await this.app.vault.read(file);
    
          // Remove the metadata from the content
          const metadataRegex = /^---\s*\n[\s\S]+?\n---\s*\n/;
          content = content.replace(metadataRegex, '');

          // Remove specific tags like "#timeline"
          const tagRegex = /#timeline\b/g;
          content = content.replace(tagRegex, '');
    
          // Set the content to the noteContentEl and mark as loaded
          noteContentEl.setText(content);
          dropdownButton.classList.add('is-loaded'); // Mark as loaded
        }
        
        noteContentEl.style.display = 'block';
        dropdownButton.setText('^'); // Change button text to indicate content is shown
      } else {
        noteContentEl.style.display = 'none';
        dropdownButton.setText(''); // Change button text to indicate content is hidden
      }
    });

    const noteContentEl = container.createEl('div', { cls: 'note-content', attr: { style: 'display: none;' }});

    container.appendChild(noteContentEl);

    // Add a click event listener to open the file in the existing pane or a new pane.
    cardItem.addEventListener('click', () => {
      const existingView = this.app.workspace.getLeavesOfType('markdown').find(leaf => leaf.view.getState().file === file.path);
      if (existingView) {
        this.app.workspace.setActiveLeaf(existingView);
        // Optionally, if you need to focus the content of the leaf, you can do so here.
      } else {
        this.app.workspace.openLinkText(file.path, '', true);
      }
    });
  }

  async onClose() {
    // Nothing to clean up.
  }
}