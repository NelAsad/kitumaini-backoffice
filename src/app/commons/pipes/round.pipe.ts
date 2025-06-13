import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'roundNumber',
    standalone: true
})

export class roundNumberPipe implements PipeTransform {
    transform(value: number): number {
        const factor = Math.pow(10, 5);
        return Math.round(value * factor) / factor;
    }
}