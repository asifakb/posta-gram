import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {PgPost} from '../model/PgPost';
import {PgComments} from '../model/PgComment';
import {PgLike} from '../model/PgLike';
import {PgCollection} from '../model/PgCollection';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators'



@Injectable({
  providedIn: 'root'
})

export class PostserviceService {

   servicePostUrl : string = "http://localhost:8080/pg-data-api/allposts";
   serviceCommentsUrl: string = "http://localhost:8080/pg-data-api/recentpostcomment";
   likesUrl: string = "http://localhost:8080/pg-data-api/getpostlikes"

   pgPosts: PgPost[] = [];
   pgComments : PgComments;
   pgLikes : PgLike[] = [];

   pgCollection : PgCollection[] = [];
 
   
   constructor(private http: HttpClient) { 

    
   }

    //  getPosts() {
  //    return this.http.get<PgPost[]>(this.servicePostUrl);
  //  }

  //  getComments(postId : number){
  //    return this.http.get<PgComments[]>(this.serviceCommentsUrl + '?id=' + postId);
  //  }

  //  getLikes(postId: number){
  //    return this.http.get<PgLike[]>(this.likesUrl+ '?id=' + postId);
  //  }

  getPgProfile() : Observable<Array<PgCollection>>{
        
    const result: Subject<Array<PgCollection>> = new Subject<Array<PgCollection>>();

          const http$ = this.http.get<PgPost[]>(this.servicePostUrl);

          http$
            .pipe(
                     catchError(err => {
                     console.log('Error In getPosts()...', err);
                     return throwError(err);
                     })
                 )
                 
            .subscribe(incomingPosts => { 
                    this.pgPosts = incomingPosts;
                    let tmpCollect : Array<PgCollection> = [];
                    this.pgPosts.forEach(post => { //OUTER LOOP
                        let tmpObject = new PgCollection();
                        tmpObject.imageUrl = post.imagePath;
                        this.http.get<PgComments>(this.serviceCommentsUrl + '?id=' + post.id).subscribe(inComments => {
                              this.pgComments = inComments;
                                  if(this.pgComments !== undefined)
                                      tmpObject.commentText = this.pgComments.commentText;
                                  if(this.pgComments !== undefined)
                                      tmpObject.userName = this.pgComments.pgUser.userName;
                        },
                        error => { console.log('Error Retrieving Comments', error) });
                        
                        this.http.get<PgLike[]>(this.likesUrl + '?id=' + post.id).subscribe(inlikes => {
                              this.pgLikes = inlikes;
                              tmpObject.likeCount =  this.pgLikes[0].likeCount;
                          },
                        error => { console.log('Error Retrieving Likes', error) });
                    tmpCollect.push(tmpObject);
                    this.pgCollection = tmpCollect;
                    result.next(tmpCollect);
                }); // OUTER LOOP
                result.complete();
            },
            err => console.log('Eror getting posts', err),
            () => console.log('Finally called in get Posts.') );
        return result;
      }
}
