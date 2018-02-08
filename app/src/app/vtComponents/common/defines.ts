import {
    Pipe,
    PipeTransform,
} from '@angular/core';

export enum VTColumnTypes {
    String = 0,
    Number = 1,
    Currency = 2
}
export enum VTFieldTypes {
    String = 0,
    Number = 1,
    Currency = 2
}

@Pipe({name: 'numberformat'})
export class NumberFormatPipe implements PipeTransform {
  transform(value: any, format: any): string {
    if (typeof value !== 'number') return value;
    if (!value) value = 0;
    switch (format) {
      case VTColumnTypes.Currency:
      case 'number':
        return 'R$ ' + value.toFixed(2);
      default:
        return format + ' ' + value.toFixed(2);
    }


  }
}
@Pipe({name: 'dateformat'})
export class DateFormatPipe implements PipeTransform {
  transform(value: any): string {
    var date = new Date(value);
    return date.getUTCDate()+"/"+(date.getUTCMonth()+1)+'/'+date.getFullYear();


  }
}
