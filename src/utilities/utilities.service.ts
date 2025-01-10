import { Injectable } from '@nestjs/common';
import { CreateUtilityDto } from './dto/create-utility.dto';
import { UpdateUtilityDto } from './dto/update-utility.dto';
import {Utility} from "./entities/utility.entity";
import { Location, Ocean } from '../locations/entities/location.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UtilitiesService {
  create(createUtilityDto: CreateUtilityDto) {
    const utility = new Utility();
    utility.id = this.getRandomId();
    utility.name = createUtilityDto.name
    utility.description = createUtilityDto.description;
    utility.location = this.generateLocationResponse(createUtilityDto.locationId);
    utility.type = createUtilityDto.type;
    utility.dates = createUtilityDto.dates;
    utility.createdAt = new Date();
    return utility;
  }

  findAll() {
    return this.utilitiesGenerator();
  }

  findOne(id: string) {
    return this.generateRandomResponse(id);
  }

  findByTypeAndOrDate(type?: string, date?: string[]) {
    console.log(type);
    console.log(date);
    if (type == undefined || date == undefined) {
      return [this.generateRandomResponse(this.getRandomId(), this.getRandomId()), this.generateRandomResponse(this.getRandomId(), this.getRandomId())];
    } else if (date == undefined) {
      return [this.generateRandomResponse(this.getRandomId(), this.getRandomId(), type), this.generateRandomResponse(this.getRandomId(), this.getRandomId(), type)];
    } else if (type == undefined) {
      return [this.generateRandomResponse(this.getRandomId(), this.getRandomId(), undefined, date), this.generateRandomResponse(this.getRandomId(), this.getRandomId(), undefined, date)];
    } else {
      return [this.generateRandomResponse(this.getRandomId(), this.getRandomId(), type, date), this.generateRandomResponse(this.getRandomId(), this.getRandomId(), type, date)];
    }
  }

  update(id: string, updateUtilityDto: UpdateUtilityDto) {
    const utility = new Utility();
    utility.id = id
    utility.name = updateUtilityDto.name
    utility.description = updateUtilityDto.description;
    utility.location = this.generateLocationResponse(updateUtilityDto.locationId);
    utility.type = updateUtilityDto.type;
    utility.dates = updateUtilityDto.dates;
    utility.createdAt = new Date();
    return utility;
  }

  remove(id: string) {
    return `This action removes a ${id} utility`;
  }

  private getRandomId() {
    return uuidv4();
  }
  private generateRandomResponse(id?: string, locationId?: string, type?: string, dates?: string[]) : Utility {
    const utility = new Utility();
    if (id == undefined) {
      utility.id = this.getRandomId()
    } else {
      utility.id = id;
    }
    utility.name = 'Toilet Velperplein';
    utility.description = 'This is the toilet at Velperplein which is open from 08:00 till 22:00.';
    if (locationId == undefined) {
      utility.location = this.generateLocationResponse();
    } else {
        utility.location = this.generateLocationResponse(locationId);
    }
    utility.createdAt = new Date();
    if (type == undefined) {
      utility.type = 'toilet';
    } else {
      utility.type = type;
    }
    if (dates == undefined) {
      const date = new Date("2025-08-20").setDate(new Date("2025-08-20").getDate() + 1);
      utility.dates = [new Date("2025-08-20").toDateString(), new Date(date).toDateString()];
    } else {
      console.log(dates);
      utility.dates = []
      dates.forEach(date => {
        console.log(date);
        console.log(utility.dates);
        utility.dates.push(date);
      })
    }
    return utility;
  }

  private generateLocationResponse(id?: string) : Location {
    const location = new Location();
    if (id == undefined) {
      location.id = this.getRandomId()
    } else {
      location.id = id;
    }
    location.location = {longitude: 51.985103, latitude: 5.898730};
    location.icon = 'cheese_wheel';
    location.createdAt = new Date();
    location.ocean = Ocean.Blue;
    location.name = 'Velperplein';



    return location;
  }

  private utilitiesGenerator(): Utility[] {
    const locations: Location[] = [
      {
        id: this.getRandomId(),
        name: 'Blue Harbor',
        location: { latitude: 52.396708, longitude: 4.8791273 },
        icon: 'toilet',
        createdAt: new Date(),
        ocean: Ocean.Blue,
      },
      {
        id: this.getRandomId(),
        name: 'Azure Port',
        location: { latitude: 52.4033065, longitude: 4.8754366 },
        icon: 'info',
        createdAt: new Date(),
        ocean: Ocean.Blue,
      },
      {
        id: this.getRandomId(),
        name: 'Sapphire Bay',
        location: { latitude: 52.4108988, longitude: 4.8740633 },
        icon: 'food',
        createdAt: new Date(),
        ocean: Ocean.Blue,
      },
      {
        id: this.getRandomId(),
        name: 'Emerald Shore',
        location: { latitude: 52.4091884, longitude: 4.8774107 },
        icon: 'drink',
        createdAt: new Date(),
        ocean: Ocean.Green,
      },
      {
        id: this.getRandomId(),
        name: 'Verdant Cove',
        location: { latitude: 52.3948399, longitude: 4.8951776 },
        icon: 'activity',
        createdAt: new Date(),
        ocean: Ocean.Green,
      },
      {
        id: this.getRandomId(),
        name: 'Snowy Haven',
        location: { latitude: 52.3987874, longitude: 4.8961067 },
        icon: 'toilet',
        createdAt: new Date(),
        ocean: Ocean.White,
      },
      {
        id: this.getRandomId(),
        name: 'Frosty Beach',
        location: { latitude: 52.3845927, longitude: 4.8994541 },
        icon: 'info',
        createdAt: new Date(),
        ocean: Ocean.White,
      },
      {
        id: this.getRandomId(),
        name: 'Iceberg Point',
        location: { latitude: 52.3964307, longitude: 4.9029732 },
        icon: 'food',
        createdAt: new Date(),
        ocean: Ocean.White,
      },
      {
        id: this.getRandomId(),
        name: 'Golden Sands',
        location: { latitude: 52.3780592, longitude: 4.8986108 },
        icon: 'drink',
        createdAt: new Date(),
        ocean: Ocean.Yellow,
      },
      {
        id: this.getRandomId(),
        name: 'Amber Cove',
        location: { latitude: 52.376435, longitude: 4.9145754 },
        icon: 'activity',
        createdAt: new Date(),
        ocean: Ocean.Yellow,
      },
      {
        id: this.getRandomId(),
        name: 'Citrine Bay',
        location: { latitude: 52.3741818, longitude: 4.9332864 },
        icon: 'toilet',
        createdAt: new Date(),
        ocean: Ocean.Yellow,
      },
      {
        id: this.getRandomId(),
        name: 'Scarlet Reef',
        location: { latitude: 52.3707233, longitude: 4.9088247 },
        icon: 'info',
        createdAt: new Date(),
        ocean: Ocean.Red,
      },
      {
        id: this.getRandomId(),
        name: 'Crimson Bay',
        location: { latitude: 52.3640675, longitude: 4.9206693 },
        icon: 'food',
        createdAt: new Date(),
        ocean: Ocean.Red,
      },
      {
        id: this.getRandomId(),
        name: 'Ruby Shore',
        location: { latitude: 52.3660591, longitude: 4.9344881 },
        icon: 'drink',
        createdAt: new Date(),
        ocean: Ocean.Red,
      },
    ];

    const utilities: Utility[] = [
      {
        id: this.getRandomId(),
        name: 'Toilet',
        description: 'Een openbaar toilet beschikbaar van 08:00 tot 22:00.',
        location: locations[0],
        dates: ['Wed Aug 20 2025', 'Thu Aug 21 2025', 'Fri Aug 22 2025', 'Sat Aug 23 2025', 'Sun Aug 24 2025'],
        type: 'Toilet',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Infopunt',
        description: 'Een infobalie om bezoekers te helpen.',
        location: locations[1],
        dates: ['Wed Aug 20 2025', 'Thu Aug 21 2025', 'Fri Aug 22 2025', 'Sat Aug 23 2025', 'Sun Aug 24 2025'],
        type: 'Informatiepunt',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Foodtruck Vis',
        description: 'Een eetkraam met een verscheidenheid aan snacks en maaltijden.',
        location: locations[2],
        dates: ['Wed Aug 20 2025', 'Thu Aug 21 2025', 'Fri Aug 22 2025', 'Sat Aug 23 2025', 'Sun Aug 24 2025'],
        type: 'Eten',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Cola Tappunt',
        description: 'Een drankkraam met verfrissende dranken.',
        location: locations[3],
        dates: ['Wed Aug 20 2025', 'Thu Aug 21 2025', 'Fri Aug 22 2025', 'Sat Aug 23 2025', 'Sun Aug 24 2025'],
        type: 'Drinken',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Game cafe',
        description: 'Een gebied voor leuke activiteiten en spelletjes.',
        location: locations[4],
        dates: ['Wed Aug 20 2025', 'Thu Aug 21 2025', 'Fri Aug 22 2025', 'Sat Aug 23 2025', 'Sun Aug 24 2025'],
        type: 'Activiteit',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Toilet',
        description: 'Een toilet beschikbaar voor openbaar gebruik.',
        location: locations[5],
        dates: ['Wed Aug 20 2025', 'Thu Aug 21 2025', 'Fri Aug 22 2025', 'Sat Aug 23 2025', 'Sun Aug 24 2025'],
        type: 'Toilet',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Infopunt',
        description: 'Een plek om hulp en informatie te krijgen.',
        location: locations[6],
        dates: ['Wed Aug 20 2025', 'Thu Aug 21 2025', 'Fri Aug 22 2025', 'Sat Aug 23 2025', 'Sun Aug 24 2025'],
        type: 'Informatiepunt',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Unox Stand',
        description: 'Een plek om snel snacks en maaltijden te halen.',
        location: locations[7],
        dates: ['Wed Aug 20 2025', 'Thu Aug 21 2025', 'Fri Aug 22 2025', 'Sat Aug 23 2025', 'Sun Aug 24 2025'],
        type: 'Eten',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Warme Chocomelk',
        description: 'Een kraam met een verscheidenheid aan dranken en sappen.',
        location: locations[8],
        dates: ['Wed Aug 20 2025', 'Thu Aug 21 2025', 'Fri Aug 22 2025', 'Sat Aug 23 2025', 'Sun Aug 24 2025'],
        type: 'Drinken',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Kaart spellen',
        description: 'Geniet hier van spelletjes en recreatieve activiteiten.',
        location: locations[9],
        dates: ['Wed Aug 20 2025', 'Thu Aug 21 2025', 'Fri Aug 22 2025', 'Sat Aug 23 2025', 'Sun Aug 24 2025'],
        type: 'Activiteit',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Toilet',
        description: 'Een schoon toilet beschikbaar voor bezoekers.',
        location: locations[10],
        dates: ['Wed Aug 20 2025', 'Thu Aug 21 2025', 'Fri Aug 22 2025', 'Sat Aug 23 2025', 'Sun Aug 24 2025'],
        type: 'Toilet',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Infopunt',
        description: 'Informatie en hulp beschikbaar hier.',
        location: locations[11],
        dates: ['Wed Aug 20 2025', 'Thu Aug 21 2025', 'Fri Aug 22 2025', 'Sat Aug 23 2025', 'Sun Aug 24 2025'],
        type: 'Informatiepunt',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: "Nando's nachos",
        description: 'Een eetkraam die heerlijke maaltijden aanbiedt.',
        location: locations[12],
        dates: ['Wed Aug 20 2025', 'Thu Aug 21 2025', 'Fri Aug 22 2025', 'Sat Aug 23 2025', 'Sun Aug 24 2025'],
        type: 'Eten',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Heineken Bar',
        description: 'Geniet hier van een scala aan dranken.',
        location: locations[13],
        dates: ['Wed Aug 20 2025', 'Thu Aug 21 2025', 'Fri Aug 22 2025', 'Sat Aug 23 2025', 'Sun Aug 24 2025'],
        type: 'Drinken',
        createdAt: new Date(),
      },
      {
        id: this.getRandomId(),
        name: 'Dansvloer',
        description: 'Een levendig gebied voor activiteiten en entertainment.',
        location: locations[14],
        dates: ['Wed Aug 20 2025', 'Thu Aug 21 2025', 'Fri Aug 22 2025', 'Sat Aug 23 2025', 'Sun Aug 24 2025'],
        type: 'Activiteit',
        createdAt: new Date(),
      },
    ];

    return utilities;

  }

}
