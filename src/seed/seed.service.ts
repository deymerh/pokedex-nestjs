import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from 'src/interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

const URL = 'https://pokeapi.co/api/v2/pokemon?limit=650';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>) { }

  async executeSeed() {

    await this.pokemonModel.deleteMany({});

    const { data } = await this.axios.get<PokeResponse>(URL);
    
    const pokemonToInsert: { name: string, no: number }[] = [];
    
    data.results.forEach(({ name, url }) => {
      const segements = url.split('/');
      const no = +segements[segements.length - 2];
      pokemonToInsert.push({ name, no })
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed executed succesfully!';
  }

}
