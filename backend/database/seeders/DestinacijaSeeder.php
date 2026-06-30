<?php

namespace Database\Seeders;

use App\Models\Destinacija;
use Illuminate\Database\Seeder;

class DestinacijaSeeder extends Seeder
{
    public function run(): void
    {
        $destinations = [
            [
                'naziv' => 'Kopaonik',
                'drzava' => 'Srbija',
                'opis' => 'Najpoznatiji srpski planinski centar sa odličnim stazama za skijanje i pešačenje.',
                'kategorija' => 'planine',
            ],
            [
                'naziv' => 'Dubrovnik',
                'drzava' => 'Hrvatska',
                'opis' => 'UNESCO grad sa impresivnim zidinama i Jadranskim morem.',
                'kategorija' => 'more',
            ],
            [
                'naziv' => 'Beograd',
                'drzava' => 'Srbija',
                'opis' => 'Glavni grad sa bogatom noćnom scenom, Kalemegdanom, Savom i Dunavom.',
                'kategorija' => 'grad',
            ],
            [
                'naziv' => 'Santorini',
                'drzava' => 'Grčka',
                'opis' => 'Ostrvo sa belim kućama, plavim kupolama i spektakularnim zalaskom sunca.',
                'kategorija' => 'more',
            ],
            [
                'naziv' => 'Prag',
                'drzava' => 'Češka',
                'opis' => 'Srednjovekovni grad sa Karlštejnom, mostovima i odličnim pivom.',
                'kategorija' => 'grad',
            ],
            [
                'naziv' => 'Zermatt',
                'drzava' => 'Švajcarska',
                'opis' => 'Alpinski resort ispod Matterhorna, idealan za skijanje i planinarenje.',
                'kategorija' => 'planine',
            ],
            [
                'naziv' => 'Barcelona',
                'drzava' => 'Španija',
                'opis' => 'Grad Gaudíja, plaža i kultura — savršena mešavina grada i mora.',
                'kategorija' => 'grad',
            ],
            [
                'naziv' => 'Budva',
                'drzava' => 'Crna Gora',
                'opis' => 'Jadransko letovalište sa starim gradom i živahnom rivijerom.',
                'kategorija' => 'more',
            ],
        ];

        foreach ($destinations as $destination) {
            Destinacija::create($destination);
        }
    }
}

