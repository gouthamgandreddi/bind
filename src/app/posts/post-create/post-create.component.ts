import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validator, Validators} from '@angular/forms';
import {PostsService} from '../posts.service';
import {ActivatedRoute, convertToParamMap, ParamMap, Router, Routes} from '@angular/router';
import {Post} from '../post.model';
import {until} from "selenium-webdriver";
import titleContains = until.titleContains;
import {validate} from "codelyzer/walkerFactory/walkerFn";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  private mode = "create";
  private postId: string;
  post : Post;
  form: FormGroup;
  isLoading = false;
  imagePreview: any;
  constructor( public postService:PostsService,private router:Router,
               public route:ActivatedRoute) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      'title':new FormControl(null,{
        validators:[Validators.required,Validators.minLength(3)]
      }),
      'content': new FormControl(null,{
        validators:[Validators.required,Validators.minLength(3)]
      }),
      'image': new FormControl(null,{
        validators:[Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.post = this.postService.getPost(this.postId);
        this.form.setValue({
          'title':this.post.title,
          'content':this.post.content,
          'image':this.post.imagePath
        });
      }else {
        this.mode = 'create';
        this.postId = null ;
      }
    });
  }

  onImagePicked(event:Event){
    const file = (event.target as HTMLInputElement).files[0]; //is a file object
    this.form.patchValue({
      'image':file
    });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader(); //creating a reader
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
  onSavePost() {
    if(this.form.invalid){
      return;
    }
    this.isLoading=true;
    if(this.mode === 'create'){
      this.postService.addPosts(
          this.form.value.title,
          this.form.value.content,
          this.form.value.image);
      this.router.navigate(['/']);
    }else{
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
          this.form.value.image);
      this.router.navigate(['/']);
    }
    this.form.reset();
  }
}

