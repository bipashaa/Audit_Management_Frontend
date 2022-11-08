import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../CheckList/question';
import { Microservices } from '../Models/Microservices';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  readonly APIUrl = Microservices['checklist'];
  private _responses: Question[] = [];
  noOfNos: number = 0;

  public get responses(): Question[] {
    return this._responses;
  }

  getQuestionsFromMS(type: string): Observable<Question[]> {
    return this.http.post<Question[]>(
      this.APIUrl + '/audit-checklist-questions',
      { auditType: type }
    );
  }

  healthCheck(): Observable<any> {
    return this.http.get<any>(this.APIUrl + '/health-check', {
      responseType: 'text' as 'json',
    });
  }

  getResponse(responses: Question[]): void {
    this._responses = responses;
    //this.sendResponse();
  }

  sendResponse(): Question[] {
    return this._responses;
  }

  validated(questions: Question[]) {
    for (let q of questions) {
      if (q.response != 'YES' && q.response != 'NO') {
        return false;
      }
    }
    this._responses = questions;
    return true;
  }

  getAuditType(): string {
    //
    return this._responses[0].auditType;
  }

  // callback function which will update the number of no's
  // when user selects any option
  getNoOfNos(data: any): void {
    this.noOfNos = data;
  }

  constructor(private http: HttpClient) {}
}
