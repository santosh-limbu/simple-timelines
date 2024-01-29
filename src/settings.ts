import TimelinePlugin from "src/main";
import { App, PluginSettingTab, Setting } from "obsidian";


export class TimelineSettings extends PluginSettingTab {
    plugin: TimelinePlugin;

    constructor(app: App, plugin: TimelinePlugin) {
        super(app, plugin);
        this.plugin = plugin;

    }

    display(): void {

        this.containerEl.empty();
        
        new Setting(this.containerEl)
        .setName("Search Tag")
        .setDesc("How Timelines are identified.")
        .addText((text) =>
          text
            .setPlaceholder("#timeline")
            .setValue(this.plugin.settings.searchTag)
            .onChange(async (value) => {
                this.plugin.settings.searchTag = value;
                await this.plugin.saveSettings();
              })
        );
    }
}

