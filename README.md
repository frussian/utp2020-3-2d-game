# "Вьетнамские флешбеки"

2D шутер с видом сверху.

* Антон Серёгин - https://github.com/frussian
* Александр Штейников - https://github.com/Snake5932
* Алексей Мартынов - https://github.com/AlexMartpr
* Степан Фураев - https://github.com/furstepnik

## Управление:
- WASD - перемещение
- ЛКМ - стрельба
- СКМ - изменение режима стрельбы
- R - перезарядка
- E - подобрать оружие
- G - бросить гранату
- F - открыть/закрыть дверь
- Q - занять/выйти из укрытия
- ESC - пауза/пропустить заставку

## Об игре:
#### Геймплей
Игра представляет собой 2D шутер с видом сверху. По лору игры действие происходит во времена войны во Вьетнаме,
игроку предстоит исследовать карту, представляющую собой джунгли с деревней, и уничтожать всех встреченных противников,
что в конечном итоге и является целью главного героя.

#### Жизни
Наша игра задумывалась как шутер с высокой сложностью, поэтому игрок имеет всего четыре жизни, а каждая попавшая в него пуля
снимает две из них. Еще одним препятствием будет колючая проволока, часть ее будет находиться на виду, а часть спрятана, и игроку
придется быть внимательным и смотреть куда он движется.

#### Зрение
Также мы хотели добавить немного тактической составляющей в нашу игру, следствием этого стало введение "зрения".
Оно действует как для игрока, так и для ботов. Так, например, игрок не видит противников за большинством препятствий, или когда
угол между прицелом и ботом с вершиной в точке, в которой находится игрок, становится тупым.

#### Динамические блоки
На карте присутствуют блоки, с которыми можно взаимодействовать.
Так стекло можно разбить, чтобы пройти, выстрелив из оружия, а дверь можно открыть.
Также присутствуют укрытия, которыми можно воспользоваться, нажав соответствующую клавишу, в таком случае игрок виден за укрытием,
но попасть в него не получится.

#### Вооружение
В распоряжении игрока находятся М16 с тремя магазинами на 20 патронов каждый и 2 гранаты. Также оружие можно подбирать в определенных
местах на карте. Так, можно найти М16, АК47 и дробовик Remington 870. Каждое оружие обладает
своими уникальными характеристиками: время перезарядки, скорострельность, точность, скорость пули. Дробовик стреляет по площадям,
а автоматическое оружие имеет одиночный и автоматический режимы стрельбы.

#### Интерфейс
В верхнем левом углу игрок может увидеть оставшееся количество жизней, чуть ниже находится количество патронов в магазине, еще ниже
еще ниже находятся индикаторы остальных магазинов. Справа от них находится индикатор оставшихся гранат. Под индикаторами боезапаса
находится переключатель режима стрельбы. В правом нижнем углу расположена миникарта, белый квадрат означает текущую видимую зону.
Если на видимой части карты нет противников, то направление к ближайшему из них укажет красная точка на краю экрана.

В игре используются следующие музыкальные композиции:
- The Doors - The End
- Creedence Clearwater Revival - Fortunate Son
