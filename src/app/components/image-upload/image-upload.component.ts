import {Component, EventEmitter, Input, Output} from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {NgForOf} from "@angular/common";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatLabel} from "@angular/material/form-field";
import {MatList, MatListItem, MatListItemIcon, MatListItemLine, MatListItemTitle} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    NgForOf,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatLabel,
    MatList,
    MatListItem,
    MatIcon,
    MatListItemLine,
    MatListItemTitle,
    MatListItemIcon
  ],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent {

  @Input() requiredFileType: string = '';
  @Output() imageEvent = new EventEmitter<string>();

  private imgurUrl = "https://api.imgur.com/3/image";
  fileArray: string[] = [];

  constructor(private http: HttpClient) {}

  uploadImage(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    const headers = new HttpHeaders({ Authorization: 'Client-ID aca6d2502f5bfd8' });

    if (file) {
      this.fileArray.push(file.name)
      const formData = new FormData();
      formData.append('image', file);

      this.http.post<any>(this.imgurUrl, formData, { headers: headers, responseType: "json" }).subscribe(
        response => {
          console.log(response.data.link)
          this.imageEvent.emit(response.data.link)
        }
      );
    }
  }
}
