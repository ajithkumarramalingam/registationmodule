import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor(private http:HttpClient) { }
  url="http://localhost:5000";
  
  insertData(data:any){
    return this.http.post(this.url+'/insert',data);
  }
  dropdown(){
    return this.http.get(this.url+'/dropdown');
  }
  dropdown1(){
    return this.http.get(this.url+'/dropdown1');
  }
  verifyToken(token:any){
    return this.http.put(this.url+'/verify',{token:token});
  }
  login(data:any){
    return this.http.post(this.url+'/login',data);
  }

  
  

  

  











  
  
  

}
