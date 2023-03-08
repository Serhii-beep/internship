import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  file!: File | null;
  fileName = '';
  errorMessage = '';
  email = '';
  fileSent = true;
  sub!: Subscription;
  acceptableFileType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  constructor(private matSnackBar: MatSnackBar,
  private _httpClient: HttpClient) {}

  sendFile() {
    const emailReg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(!emailReg.test(this.email)) {
      this.matSnackBar.open("Enter a valid email address", "Ok");
    }
    else if(!this.file) {
      this.matSnackBar.open("Choose a valid file", "Ok");
    }
    else
    {
      const domain = this.email.split('.');
      if(domain[domain.length - 1] == "ru" || domain[domain.length - 1] == "rus") {
        this.matSnackBar.open("Glory to Ukraine", "Ok");
      } else {
        this.fileSent = false;
        const formData = new FormData();
        formData.append(this.file.name, this.file);
        formData.append('email', this.email);
        this.sub = this._httpClient.post('https://internshipspeshko.azurewebsites.net/api/file', formData)
          .subscribe(resp => {
            this.fileSent = true;
            this.matSnackBar.open('File has been sent successfuly', 'Ok');
          }, error => {
            this.fileSent = true;
            console.log(error);
          })
      }
    }
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if(this.file) {
      if(this.file.type !== this.acceptableFileType) {
        this.errorMessage = "Invalid file type. Acceptable file types: .docx";
        this.fileName = '';
        this.file = null;
      } else {
        this.fileName = this.file.name;
        this.errorMessage = '';
      }
    } 
  }

  ngOnDestroy(): void {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }
}
