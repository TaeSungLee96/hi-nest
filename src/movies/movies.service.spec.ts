import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const moudle: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = moudle.get<MoviesService>(MoviesService);
  });

  it('should defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('Should return array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('Should retrun movie', () => {
      service.create({
        title: 'test Title',
        geners: ['Comic'],
        year: 2000,
      });
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
      expect(movie.title).toEqual('test Title');
    });

    it('Should return 404 error', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('deleteOne', () => {
    it('Should delete movie', () => {
      service.create({
        title: 'test',
        geners: ['comic'],
        year: 2000,
      });
      const preMovieCount = service.getAll().length;
      service.deleteOne(1);
      const curMovieCount = service.getAll().length;
      expect(preMovieCount).toBeGreaterThan(curMovieCount);
    });

    it('Should return 404 error', () => {
      try {
        service.create({
          title: 'test',
          geners: ['comic'],
          year: 2000,
        });
        service.deleteOne(2);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create', () => {
    it('Should create movie', () => {
      const beforeCreate = service.getAll().length;
      service.create({
        title: 'test',
        geners: ['comic'],
        year: 2000,
      });
      const movieTitle = service.getOne(1).title;
      const afterCreate = service.getAll().length;
      expect(movieTitle).toEqual('test');
      expect(beforeCreate).toBeLessThan(afterCreate);
    });
  });

  describe('update', () => {
    it('Shoule update movie', () => {
      service.create({
        title: 'test',
        geners: ['comic'],
        year: 2000,
      });
      service.update(1, { title: 'test222' });
      const updatedMovie = service.getOne(1).title;
      expect(updatedMovie).toEqual('test222');
    });

    it('Should throw a NotFoundException', () => {
      try {
        service.create({
          title: 'test',
          geners: ['comic'],
          year: 2000,
        });
        service.update(2, { title: 'test222' });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
