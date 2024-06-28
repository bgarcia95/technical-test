import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Data {
  name: string; 
  number?: number; 
  type?: ObjectType;
}

export enum ObjectType {
  Fizz = 'fizz',
  Buzz = 'buzz',
  FizzBuzz = 'fizzbuzz',
  MinusFizz = 'minus fizz',
  MinusBuzz = 'minus buzz',
  MinusFizzBuzz = 'minus fizzbuzz',
  Idk = 'idk',
  MinusIdk = 'minus idk'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {

  constructor(private sanitizer: DomSanitizer) {}

  currentShape:SafeHtml = "";
  currentElement?:Data;
  public index:number = 0;
  showModal:boolean = false;
  public favoriteShapes: (Data & {html?: SafeHtml})[] = [];
  buttonLabel: string = ''
  

  public data: Data[]  = [
    {
      type: ObjectType.Idk,
      name: "Object 1",
      number: 7
    },
    {
      type: ObjectType.Fizz,
      name: "Object 2",
      number: 3
    },
    {
      type: ObjectType.Buzz,
      name: "Object 3",
      number: 5
    },
    {
      type: ObjectType.FizzBuzz,
      name: "Object 4",
      number: 15,
    },
    {
      name: "Object 5"
    },
    {
      type: ObjectType.MinusFizz,
      name: "Object 6",
      number: -12
    },
    {
      type: ObjectType.MinusFizzBuzz,
      name: "Object 6.5",
      number: -30
    },
    {
      type: ObjectType.MinusIdk,
      name: "Object 7",
      number: -7
    }
  ]


  onClickBtn():void {
    this.currentShape = this.generateShape(this.data[this.index]);
    this.currentElement = this.data[this.index];
    this.index = (this.index + 1) % this.data.length;
  }

  onClickShape():void {
    this.showModal = !this.showModal;
  }

  onAddToFavorites():void {
    this.getButtonLabel()
    const elementIndex = this.favoriteShapes.findIndex((element) =>  element.name === this.currentElement?.name);

    if(elementIndex !== -1) {
      this.favoriteShapes = this.favoriteShapes.filter(element => element.name !== this.currentElement?.name)
    } else {
      this.favoriteShapes.push({...this.currentElement as Data, html: this.currentShape});
    }

  }


  title = 'technical-test';

  generateShape(object: Data): SafeHtml {
    let shapeClass = 'flex justify-center items-center h-52 w-52';
    let additionalStyle = '';
    let shape = 'div';

    switch(object.type) {
      case ObjectType.Fizz:
        shapeClass += ' bg-red-500';
        break;
      case ObjectType.Buzz:
        shapeClass += ' bg-red-500 rounded-full';
        break;
      case ObjectType.FizzBuzz:
        additionalStyle = `border-radius: ${object.number}px`;
        shapeClass += ' bg-red-500';
        break;
        case ObjectType.MinusFizz:
          shapeClass += ' bg-blue-500';
          break;
        case ObjectType.MinusBuzz:
          shapeClass += ' bg-blue-500';
          break;
        case ObjectType.MinusFizzBuzz:
          additionalStyle = `border-radius: ${object.number}px`;
          shapeClass += ' bg-blue-500';
          break;
      default:
        return this.sanitizer.bypassSecurityTrustHtml('<p class="text-center">No shape available for this object.</p>');
    }

    const htmlString = `<${shape} class='${shapeClass}' style='${additionalStyle}' aria-label='${object.name}'>${object.name}</${shape}>`;
    return this.sanitizer.bypassSecurityTrustHtml(htmlString);
  }

  isElementInFavorites(): boolean {
    return this.favoriteShapes.some(element => element.name === this.currentElement?.name);
  }

  isButtonDisabled(): boolean {
    if(this.currentElement?.type) {
      return this.currentElement?.type?.includes('idk') as boolean;
    } else {
      return true
    }
    
  }

  getButtonLabel(): string {
    return this.isElementInFavorites() ? 'Remove from favorites' : 'Add to favorites';
  }



}

