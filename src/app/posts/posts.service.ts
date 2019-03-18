import { Injectable } from '@angular/core';
import {Post} from './post.model';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {parseHttpResponse, post} from 'selenium-webdriver/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private postsUpdated = new Subject<Post[]>();
  private posts:Post [] = [];
  constructor(private http:HttpClient) { }

  getPosts(){
    this.http.get<{message:string,posts:any}>('http://localhost:3000/api/posts')
      .pipe(map((postData)=>{
        console.log(postData,'postData');
        return postData.posts.map(post =>{
          return {
            title: post.title,
            content: post.content,
            id:post._id,
              imagePath:post.imagePath
          };
        });
      }))
      .subscribe((transformedPosts) =>{
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePosts(postId: string){
    console.log('service -',postId);
    this.http.delete('http://localhost:3000/api/posts/'+postId)
      .subscribe(()=>{
        console.log("Deleted");
        this.getPosts();
      })
  }
  getPostUpdatelistner(){
    return this.postsUpdated.asObservable();
  }

  getPost(id: string){
    return {...this.posts.find(p =>p.id === id)};
  }

  updatePost(id:string,title:string,content:string,image:string){
    // const post: Post =
    //     {id:id,title:title,content:content,imagePath:image};
    const updateData = new FormData();
    updateData.append("title",title);
      updateData.append("content",content);
      updateData.append("image",image,title);
    this.http.put('http://localhost:3000/api/posts/'+id,updateData)
      .subscribe(response => {
        this.getPosts();
        console.log('response',response)
      });
  }
  addPosts(title:string,content:string,image:File){
      const postData = new FormData();
      postData.append("title",title);
      postData.append('content',content);
      postData.append('image',image,title);
      console.log('postData service post - ',postData );
    // var post:Post ={id:null,title:title,content:content};
    this.http.post<{message:string,postId:string}>('http://localhost:3000/api/posts',
        postData)
      .subscribe((responseData) =>{
        const post:Post ={
            id:responseData.postId,
            title:title,
            content:content,
            imagePath:responseData.postId
        };
        console.log('new post with  id', post);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      },error =>{
        console.log(error);
      })
  }
}
