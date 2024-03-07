import { Controller, Get } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';

@Controller('subcategories')
export class SubcategoriesController {
    constructor( private subcategoriesService: SubcategoriesService){}

    @Get()
    async getAllSubcategories(){
        return this.subcategoriesService.getAllSubcategories();
    }
}
