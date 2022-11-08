import { SecurityService } from './../Services/security.service';
import { Component, OnInit } from '@angular/core';
import { ChecklistService } from '../Services/checklist.service';
import { Question } from './question';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css'],
})
export class ChecklistComponent implements OnInit {
  questions: Question[] = [];
  connectionStatus: any = 'Not connected';
  type: string = '';
  message: string = '';
  loadFlag: boolean = false;
  noOfNos: number = 0;
  responses: any = new Map(); //defined a hashmap to store the selections

  constructor(
    private checklistService: ChecklistService,
    private router: Router,
    public securityService: SecurityService
  ) {}

  getQuestions(): void {
    this.loadFlag = true;
    let fetch: Question[] = [];
    this.checklistService
      .getQuestionsFromMS(this.type)
      // .subscribe(data => this.questions = data);
      .subscribe(
        (data) => {
          fetch = data;
          if (data.length == 0) {
            this.router.navigate(['backToLogin']);
          }
        },
        (err) => {
          this.router.navigate(['error']);
        },
        () => {
          this.message = '';
          this.questions = fetch;
        }
      );
  }

  connectionCheck(): void {
    this.checklistService
      .healthCheck()
      .subscribe((data) => (this.connectionStatus = data));
  }

  responseYes(i: number): void {
    this.questions[i].response = 'YES';
  }

  responseNo(i: number): void {
    this.questions[i].response = 'NO';
  }

  // responseYes(i: number): void {
  //   // this.noOfNos -= this.questions[i].response === 'YES' ? 0 : 1;
  //   // this.noOfYes += this.questions[i].response === 'YES' ? 0 : 1;

  //   if (this.responses.get(i) !== 'YES') {
  //     this.responses.set(i, 'YES');
  //   } else {
  //     this.questions[i].response = 'YES';

  //     this.noOfNos = 0;
  //     this.responses.forEach((v: string, k: number) => {
  //       console.log(k, v);
  //       if (v === 'NO') {
  //         this.noOfNos += 1;
  //       }
  //     });
  //   }

  //   this.checklistService.getNoOfNos(this.noOfNos);
  // }

  // responseNo(i: number): void {
  //   // when user selectes NO we are updating the value of that question to NO
  //   this.responses.set(i, 'NO');

  //   //to show the response on the screen
  //   this.questions[i].response = 'NO';
  //   this.noOfNos = 0; //updating no of nos as zero for every selection so that it doesn't store prev value

  //   //calculating the no. of nos by traversing the whole map
  //   this.responses.forEach((v: string, k: number) => {
  //     console.log(k, v);
  //     if (v === 'NO') {
  //       this.noOfNos += 1;
  //     }
  //   });

  //   console.log(this.noOfNos);
  //   this.checklistService.getNoOfNos(this.noOfNos); //calling the callback function so that the value in service gets updated
  // }

  getResponse(): void {
    if (this.checklistService.validated(this.questions)) {
      this.checklistService.getResponse(this.questions);
      this.securityService.turnOffSpecialFlag();
      this.message = '';
      this.router.navigate(['severity']);
    } else {
      this.message = 'Please answer all the questions to submit!!';
    }
  }

  ngOnInit(): void {
    //login comes
    this.message = '';
    this.loadFlag = false;
    this.securityService.healthCheck().subscribe(
      (data) => {},
      (err) => {
        this.router.navigate(['error']);
      },
      () => {
        this.checklistService.healthCheck().subscribe(
          (data) => {},
          (err) => {
            this.router.navigate(['error']);
          },
          () => {
            this.securityService.checkAuthFromLocal('checklist', 'backToLogin');
          }
        );
      }
    );
  }
}
