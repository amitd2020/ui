import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { ScrollPanel } from 'primeng/scrollpanel';

@Component({
    selector: 'dg-ai-response',
    templateUrl: './ai-response.component.html',
    styleUrls: ['./ai-response.component.scss'],
})
export class AiResponseComponent implements OnChanges {
    @Input() chatHistory: {
        user: string;
        aiFullLines: string[];
        aiVisibleLines: string[];
        companyStore?: object
    }[] = [];
    @Input() showLink: boolean = false;
    @Output() viewCompany = new EventEmitter<any>();
    @ViewChild(ScrollPanel) scrollPanel?: ScrollPanel;

    ngOnChanges(changes: SimpleChanges) {
        this.chatHistory = this.chatHistory;
        setTimeout(() => this.scrollToBottom(), 0);
    }

	scrollToBottom() {
        const lastMessageIndex = this.chatHistory.length - 1;
        const lastVisibleLineIndex = this.chatHistory[lastMessageIndex]?.aiVisibleLines.length - 1;
        const id = `id_${lastMessageIndex}_${lastVisibleLineIndex}`;

        const element = document.getElementById( id ) as HTMLElement;

		if ( element ) {
			element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });			
		}
	}

    showCompany(data) {
        this.viewCompany.emit( data )
    }
}
