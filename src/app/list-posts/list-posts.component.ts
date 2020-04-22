import { Component, OnInit } from '@angular/core';
import { PostserviceService} from '../services/postservice.service'
import { PgCollection } from '../model/PgCollection';
import { Subscription, Observable } from 'rxjs';
import {Router} from "@angular/router";
import { PgPost } from '../model/PgPost';
import { PgComments } from '../model/PgComment';
import { PgLike } from '../model/PgLike';


@Component({
  selector: 'app-list-posts',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.css']
})
export class ListPostsComponent implements OnInit{
  title = 'postagram';
  pgCollection: PgCollection[];
 
    constructor(private router: Router, private postService: PostserviceService){
     
  }

  ngOnInit(): void {
    this.postService.getPgProfile()
    .subscribe( data => {
      this.pgCollection = data;
      console.log("Data from the Backend")
      console.log(this.pgCollection);
    });
  }



  
    
}
