import { Component } from '@angular/core';

import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { PokemonPage } from '@pages/pokemon/pokemon';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [Header, Footer, PokemonPage],
  templateUrl: './shell.html',
})
export class Shell {}