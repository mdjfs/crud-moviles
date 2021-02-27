import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FormService } from 'src/app/services/form.service';
import { MenuService } from 'src/app/services/menu.service';
import { UserService, UserData } from 'src/app/services/user.service';

export interface MenuData {
  id: number,
  formId?: number,
  parentId?:number,
  name: string,
  childrens?: MenuData[]
}

export interface MenuParent{
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
  deepthLimit: number = 2;
  loading: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService,
    private alertController: AlertController, private router: Router, private menuService: MenuService, private formService: FormService) {

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
    const target = this.menus.filter(value => value.id == id)[0];
    if(target && target.formId) this.router.navigate(["/form",target.id])
    else this.router.navigate(["/menu",id]);
  }

  loadChildrens(){
    const parentId = this.activatedRoute.snapshot.params['id'];
    if(parentId){
      this.menuService.getMenu({id: parentId , limit: this.deepthLimit.toString()}).subscribe(
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
      this.menuService.getMenu({ limit: this.deepthLimit.toString()}).subscribe(
        (menus: MenuData[]) => {
          this.menus = menus;
        }
      )
    }
  }

  async delete(id: number){
    const menu = this.menus.filter(value => value.id == id)[0];
    const childrens = menu.childrens;
    if(childrens && childrens.length > 0){
      const alert = await this.alertController.create({
        header: `Are you sure to delete ${menu.name}? It contains ${childrens.map(value => value.name).join(',')}`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: 'Ok',
            handler: () => {
              if(menu.formId){
                this.formService.deleteForm({id: menu.formId.toString()})
              }
              this.menuService.deleteMenu(id).subscribe(
                () => this.loadChildrens()
              );
            }
          }
        ]
      });
      await alert.present();
    }else{
      this.menuService.deleteMenu(id).subscribe(
        () => this.loadChildrens()
      );
    }
  }

  async options(id: number){
    if(this.isAdmin){
      const target = this.menus.filter(value => value.id == id)[0];
      const buttons =  [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Delete',
          handler: this.delete.bind(this, id)
        }]
      if(target.childrens.length == 0 && target.formId == undefined) buttons.push({
        text: 'Create Form',
        handler: () => {
          this.router.navigate(["/form",target.id])
        }
      })
      const alert = await this.alertController.create({
        buttons: buttons
      });
      await alert.present();
    }
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
              this.menuService.createMenu({
                name: data.menu,
                parentId: this.parent.id
              }).subscribe(() => {
                this.loadChildrens();
                this.loading = false;
              });
            }
            else{
              this.menuService.createMenu({
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
