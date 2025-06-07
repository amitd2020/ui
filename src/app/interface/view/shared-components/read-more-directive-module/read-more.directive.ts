import { AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[dgReadMore]',
})

export class ReadMoreDirective implements AfterViewInit {
    @Input() dgReadMore: boolean = false;
    @Input() numberOfLines: number = 1;
    @Input() defaultLineHeight: number = 15;
    private containerHeight: number = null;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

    @HostListener('click', ['$event'])
    toggleText(event: Event): void {
        const target = event.target as HTMLElement;

        if (target.tagName === 'A') {
            const textContainer =
                this.elementRef.nativeElement.querySelector('.read-more-text');

            if (target.innerText === 'Read More') {
                this.renderer.setStyle(
                    textContainer,
                    'max-height',
                    `${textContainer.scrollHeight}px`
                );
                target.innerText = 'Read Less';
            } else {
                this.renderer.setStyle(
                    textContainer,
                    'max-height',
                    `${this.containerHeight}px`
                );
                target.innerText = 'Read More';
            }
        }
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            if (!this.dgReadMore) return;

            const container = this.elementRef.nativeElement as HTMLElement;
            const textContainer = container.querySelector(
                '.read-more-text'
            ) as HTMLElement;

            if (!textContainer) return;

            this.containerHeight = this.defaultLineHeight * this.numberOfLines;

            if (textContainer.scrollHeight > this.containerHeight) {
                this.renderer.setStyle(textContainer, 'overflow', 'hidden');
                this.renderer.setStyle(
                    textContainer,
                    'max-height',
                    `${this.containerHeight}px`
                );

                const readMoreLink = this.renderer.createElement('a');
                this.renderer.addClass(readMoreLink, 'text-sm');
                this.renderer.addClass(readMoreLink, 'c-green');
                this.renderer.setProperty(
                    readMoreLink,
                    'innerText',
                    'Read More'
                );
                this.renderer.setStyle(readMoreLink, 'cursor', 'pointer');
                this.renderer.appendChild(container, readMoreLink);
            }
        }, 0);
    }
}
