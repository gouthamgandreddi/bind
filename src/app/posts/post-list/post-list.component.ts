import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from '../posts.service';
import {Post} from '../post.model';
import {Subscription} from 'rxjs';
import {post} from 'selenium-webdriver/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {

  // posts =[
  //   {title:"Technology",content:"Scientific America"},
  //   {title:"News",content:"BBC"},
  //   {title:"Astro",content:"Astro America"}
  // ]

  //before using service to bind data
  // @Input() posts =[];
  posts :Post [] =[];
  private postsSub:Subscription;

  constructor( public postService:PostsService,
               private router:Router) { }


  ngOnInit() {
    this.postService.getPosts();
    this.postsSub=this.postService.getPostUpdatelistner()
      .subscribe((posts:Post[])=>{
        this.posts=posts;
    });
  }

  onEdit(postId:string,postTitle:string,postContent:string){
    this.router.navigate(['/edit',{id:postId,title:postTitle,content:postContent}]);
  }
  onDelete(postId:string){
    console.log('the id you want to delete - ', postId);
    this.postService.deletePosts(postId);
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
