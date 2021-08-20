import { TestBed } from '@angular/core/testing';

import { ErrorDetails, HttpService } from './http.service';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('HttpService', () => {
  let service: HttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(HttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should return undefined when server returns 404', () => {
      let succeeded = false;
      let body: string | undefined;

      service.get('42').subscribe((response) => {
        succeeded = true;
        body = response;
      });

      const testRequest = httpMock.expectOne('https://fake.url/42');
      testRequest.flush('', { status: 404, statusText: 'Not Found' });

      expect(succeeded).toBeTrue();
      expect(body).toBeUndefined();
    });

    it('should throw error with response body when server returns error other than 404', () => {
      let body: ErrorDetails | undefined;

      service.get('42').subscribe(
        () => {},
        (error: ErrorDetails) => {
          body = error;
        }
      );

      const expected: ErrorDetails = {
        code: 'validationFailed',
        message: 'Invalid input',
      };

      const testRequest = httpMock.expectOne('https://fake.url/42');
      testRequest.flush(expected, { status: 400, statusText: 'Bad Request' });

      expect(body).toEqual(expected);
    });
  });
});
