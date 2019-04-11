import { Directive, ElementRef, Input, Renderer } from '@angular/core';



@Directive({
  selector: '[ekohide]'
})
export class Hide {
  @Input()
  set ekohide(newCondition: boolean) {
    this.initDisplayStyle();
    if (newCondition && (this.isBlank(this._prevCondition) || !this._prevCondition)) {
      this._prevCondition = true;
      this._renderer.setElementStyle(this._elementRef.nativeElement, 'display', 'none');
    } else if (!newCondition && (this.isBlank(this._prevCondition) || this._prevCondition)) {
      this._prevCondition = false;
      this._renderer.setElementStyle(this._elementRef.nativeElement, 'display', this._displayStyle);
    }
  }

  private _prevCondition: boolean = null;
  private _displayStyle: string;

  constructor(private _elementRef: ElementRef, private _renderer: Renderer) { }
  isBlank(obj: any): boolean {
    return obj === undefined || obj === null;
  }

  

    

  private initDisplayStyle() {
    if (this._displayStyle === undefined) {
      let displayStyle = this._elementRef.nativeElement.style.display;
      if (displayStyle && displayStyle !== 'none') {
        this._displayStyle = displayStyle;
      }
    }
  }

  
}
