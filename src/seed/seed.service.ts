import { Injectable } from '@nestjs/common';
import { PokeResponse } from 'src/interfaces/poke-response.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

const URL = 'https://pokeapi.co/api/v2/pokemon?limit=650';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly httpAdapter: AxiosAdapter) { }

  async executeSeed() {

    await this.pokemonModel.deleteMany({});

    const data = await this.httpAdapter.get<PokeResponse>(URL);

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
