import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'dg-prompt-input',
  templateUrl: './prompt-input.component.html',
  styleUrls: ['./prompt-input.component.scss']
})
export class PromptInputComponent {
	@Output() promptSubmit = new EventEmitter<any>();
	prompt: string = '';

	constructor(){}

  async submitQuery() {
		const input = this.prompt.trim();
		if (!input) return;

		this.promptSubmit.emit(input);

		this.prompt = '';
	}

}
