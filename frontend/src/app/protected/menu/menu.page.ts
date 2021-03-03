import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ErrorHandler } from 'src/app/components/modals/error/error.page';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { FormService } from 'src/app/services/form.service';
import { MenuCreate, MenuService } from 'src/app/services/menu.service';
import { UserService, UserData } from 'src/app/services/user.service';

export interface MenuData {
  id: number,
  form_id?: number,
  parent_id?:number,
  name: string,
  childrens?: MenuData[]
}

export interface MenuParent{
  id: number,
  name?: string,
  parent_id?:number
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
  creating: boolean = false;
  generalHandlers: ErrorHandler[] = undefined;

  constructor(private activatedRoute: ActivatedRoute,  private authService: AuthService, private errorService: ErrorService,
    private alertController: AlertController, private router: Router, private menuService: MenuService, private formService: FormService) {
      this.user = this.authService.getUser();
      this.isAdmin = (this.user.role == "admin");
      this.generalHandlers = [{name: "Reload", callback: window.location.reload}];
  }

  ionViewWillEnter() {
    this.loadChildrens();
  }

  open(id: number){
    const target = this.menus.filter(value => value.id == id)[0];
    if(target && target.form_id !== null) this.router.navigate(["/form",target.id])
    else this.router.navigate(["/menu",id]);
  }

  loadChildrens(){
    this.loading = true
    const parentId = this.activatedRoute.snapshot.params['id'];
    if(parentId){
      this.menuService.getMenu({id: parentId , limit: this.deepthLimit.toString()}).subscribe(
        (menu: MenuData) => {
          this.parent = {
            id: menu.id,
            parent_id: menu.parent_id,
            name: menu.name
          }
          this.menus = menu.childrens;
        },
        (error) => this.errorService.displayError(error.toString(), this.generalHandlers)
      ).add(() => this.loading = false)
    }else{
      this.menuService.getMenu({ limit: this.deepthLimit.toString()}).subscribe(
        (menus: MenuData[]) => {
          this.menus = menus;
        },
        (error) => this.errorService.displayError(error.toString(), this.generalHandlers)
      ).add(() => this.loading = false)
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
              this.loading = true;
              const deleteMenu = () => {
                this.menuService.deleteMenu(id).subscribe(
                  () => this.loadChildrens(),
                  (error) => this.errorService.displayError(error.toString(), this.generalHandlers)
                ).add(() => this.loading = false);
              }
              if(menu.form_id){
                this.formService.deleteForm({id: menu.form_id.toString()})
                .subscribe(
                  () => deleteMenu(),
                  (error) => this.errorService.displayError(error.toString(), this.generalHandlers)
                ).add(() => this.loading = false)
              }else{
                deleteMenu()
              }
            }
          }
        ]
      });
      await alert.present();
    }else{
      this.loading = true;
      this.menuService.deleteMenu(id).subscribe(
        () => this.loadChildrens(),
        (error) => this.errorService.displayError(error.toString(), this.generalHandlers)
      ).add(() => this.loading = false);
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
      if(target.childrens.length == 0 && target.form_id == undefined) buttons.push({
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

            const create = (menu: MenuCreate) => {
              this.creating = true;
              this.menuService.createMenu(menu)
              .subscribe(
                () => this.loadChildrens(),
                (error) => this.errorService.displayError(error.toString(), this.generalHandlers)
              ).add(() => this.creating = false);
            }
            if(this.parent && this.parent.id){
              create({
                name: data.menu,
                parent_id: this.parent.id
              });
            }
            else{
              create({
                name: data.menu
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  logout(){
    this.authService.logout();
  }

}
