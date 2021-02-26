import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserService, UserData } from 'src/app/services/user.service';

interface MenuData {
  id: number,
  formId?: number,
  parentId?:number,
  name: string,
  childrens?: MenuData[]
}

interface MenuParent{
  id: number,
  name?: string,
  parentId?:number
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage {

  parent: MenuParent = undefined;
  menus: MenuData[] = [];
  isAdmin: boolean = false;
  user: UserData = undefined;
  deepthLimit: number = 1;
  loading: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private alertController: AlertController, private router: Router) {

  }

  ngOnInit(){
    this.userService.getData()
    .subscribe(
      (user: UserData) => {
        this.user = user;
        this.isAdmin = (this.user.role == "admin")
      }
    );
  }

  ionViewWillEnter() {
    this.loadChildrens();
  }

  open(id: number){
    this.router.navigate(["/menu",id]);
  }

  loadChildrens(){
    const parentId = this.activatedRoute.snapshot.params['id'];
    const observer = this.userService.getMenu(parentId, this.deepthLimit);
    if(parentId){
      observer.subscribe(
        (menu: MenuData) => {
          this.parent = {
            id: menu.id,
            parentId: menu.parentId,
            name: menu.name
          }
          this.menus = menu.childrens;
        }
      )
    }else{
      observer.subscribe(
        (menus: MenuData[]) => {
          this.menus = menus;
        }
      )
    }
  }

  options(id: number){
    console.log(id);
  }

  async create(){
    const alert = await this.alertController.create({
      header: 'Insert name',
      inputs: [
        {
          name: 'menu',
          type: 'text',
          placeholder: 'Name...'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data) => {
            this.loading = true;
            if(this.parent && this.parent.id){
              this.userService.createMenu({
                name: data.menu,
                parentId: this.parent.id
              }).subscribe(() => {
                this.loadChildrens();
                this.loading = false;
              });
            }
            else{
              this.userService.createMenu({
                name: data.menu
              }).subscribe(() => {
                this.loadChildrens();
                this.loading = false;
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

}
