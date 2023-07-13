import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto, UpdatePokemonDto } from './dto';
import { ERROR_CODES } from './shared/error-codes';
import { PaginationDto } from '../common/dto/pagination.dto';

const CERO = 0;

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>) { }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExeptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
  }

  async findOne(term: string): Promise<Pokemon> {
    let pokemon: Pokemon;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term.trim());
    }
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
    }
    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`);
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto): Promise<{
    no?: number;
    name?: string;
  }> {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });
    } catch (error) {
      this.handleExeptions(error, 'update');
    }

    return { ...pokemon.toJSON(), ...updatePokemonDto };
  }

  async remove(id: string): Promise<void> {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === CERO) {
      throw new BadRequestException(`Pokemon with ${id} not found`);
    }
  }

  private handleExeptions(err: any, action = 'create'): void {
    if (err.code === ERROR_CODES.DUPLICATE_KEY) {
      throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(err.keyValue)}`);
    }
    throw new InternalServerErrorException(`Can't ${action} Pokemon - Check logs`);
  }
}
