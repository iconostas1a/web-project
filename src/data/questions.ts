import type { Question } from '../services/storage'

export const initialQuestions: Omit<Question, 'id'>[] = [
  { type: 'frame', image_url: 'frames/matrix.jpg', options: ['Матрица', 'Терминатор', 'Бегущий по лезвию', 'Интерстеллар'], correct_answer: 'Матрица' },
  { type: 'frame', image_url: 'frames/inception.jpg', options: ['Начало', 'Престиж', 'Остров проклятых', 'Интерстеллар'], correct_answer: 'Начало' },
  { type: 'frame', image_url: 'frames/pulp_fiction.jpg', options: ['Криминальное чтиво', 'Убить Билла', 'Джанго освобожденный', 'Бесславные ублюдки'], correct_answer: 'Криминальное чтиво' },
  { type: 'frame', image_url: 'frames/shawshank.jpg', options: ['Побег из Шоушенка', 'Зеленая миля', 'Форрест Гамп', 'Список Шиндлера'], correct_answer: 'Побег из Шоушенка' },
  { type: 'frame', image_url: 'frames/godfather.jpg', options: ['Крестный отец', 'Славные парни', 'Однажды в Америке', 'Лицо со шрамом'], correct_answer: 'Крестный отец' },
  { type: 'frame', image_url: 'frames/titanic.jpg', options: ['Титаник', 'Аватар', 'Терминатор', 'Чужие'], correct_answer: 'Титаник' },
  { type: 'frame', image_url: 'frames/avatar.jpg', options: ['Аватар', 'Титаник', 'Интерстеллар', 'Гравитация'], correct_answer: 'Аватар' },
  { type: 'frame', image_url: 'frames/dark_knight.jpg', options: ['Темный рыцарь', 'Бэтмен', 'Супермен', 'Человек из стали'], correct_answer: 'Темный рыцарь' },
  { type: 'frame', image_url: 'frames/fight_club.jpg', options: ['Бойцовский клуб', 'Американская история X', 'Криминальное чтиво', 'Убить Билла'], correct_answer: 'Бойцовский клуб' },
  { type: 'frame', image_url: 'frames/forrest_gump.jpg', options: ['Форрест Гамп', 'Побег из Шоушенка', 'Зеленая миля', 'Список Шиндлера'], correct_answer: 'Форрест Гамп' },
  { type: 'frame', image_url: 'frames/gladiator.jpg', options: ['Гладиатор', 'Троя', '300 спартанцев', 'Александр'], correct_answer: 'Гладиатор' },
  { type: 'frame', image_url: 'frames/lord_of_rings.jpg', options: ['Властелин колец', 'Хоббит', 'Гарри Поттер', 'Хроники Нарнии'], correct_answer: 'Властелин колец' },
  { type: 'frame', image_url: 'frames/star_wars.jpg', options: ['Звездные войны', 'Стар Трек', 'Гардианс Галактики', 'Интерстеллар'], correct_answer: 'Звездные войны' },
  { type: 'frame', image_url: 'frames/terminator.jpg', options: ['Терминатор', 'Робокоп', 'Матрица', 'Бегущий по лезвию'], correct_answer: 'Терминатор' },
  { type: 'frame', image_url: 'frames/jurassic_park.jpg', options: ['Парк Юрского периода', 'Кинг-Конг', 'Годзилла', 'Чужой'], correct_answer: 'Парк Юрского периода' },
  
  { type: 'video', video_url: 'videos/avengers.mp4', options: ['Мстители', 'Стражи Галактики', 'Тор', 'Железный человек'], correct_answer: 'Мстители' },
  { type: 'video', video_url: 'videos/interstellar.mp4', options: ['Интерстеллар', 'Гравитация', 'Марсианин', 'Прибытие'], correct_answer: 'Интерстеллар' },
  { type: 'video', video_url: 'videos/joker.mp4', options: ['Джокер', 'Темный рыцарь', 'Бэтмен', 'Супермен'], correct_answer: 'Джокер' },
  { type: 'video', video_url: 'videos/parasite.mp4', options: ['Паразиты', 'Оскар', 'Сталкер', 'Память'], correct_answer: 'Паразиты' },
  { type: 'video', video_url: 'videos/dune.mp4', options: ['Дюна', 'Бегущий по лезвию 2049', 'Интерстеллар', 'Марсианин'], correct_answer: 'Дюна' },
  { type: 'video', video_url: 'videos/inception.mp4', options: ['Начало', 'Престиж', 'Остров проклятых', 'Интерстеллар'], correct_answer: 'Начало' },
  { type: 'video', video_url: 'videos/matrix.mp4', options: ['Матрица', 'Терминатор', 'Бегущий по лезвию', 'Интерстеллар'], correct_answer: 'Матрица' },
  { type: 'video', video_url: 'videos/pulp_fiction.mp4', options: ['Криминальное чтиво', 'Убить Билла', 'Джанго освобожденный', 'Бесславные ублюдки'], correct_answer: 'Криминальное чтиво' },
  { type: 'video', video_url: 'videos/dark_knight.mp4', options: ['Темный рыцарь', 'Бэтмен', 'Супермен', 'Человек из стали'], correct_answer: 'Темный рыцарь' },
  { type: 'video', video_url: 'videos/fight_club.mp4', options: ['Бойцовский клуб', 'Американская история X', 'Криминальное чтиво', 'Убить Билла'], correct_answer: 'Бойцовский клуб' },
  { type: 'video', video_url: 'videos/gladiator.mp4', options: ['Гладиатор', 'Троя', '300 спартанцев', 'Александр'], correct_answer: 'Гладиатор' },
  { type: 'video', video_url: 'videos/lord_of_rings.mp4', options: ['Властелин колец', 'Хоббит', 'Гарри Поттер', 'Хроники Нарнии'], correct_answer: 'Властелин колец' },
  { type: 'video', video_url: 'videos/star_wars.mp4', options: ['Звездные войны', 'Стар Трек', 'Стражи Галактики', 'Интерстеллар'], correct_answer: 'Звездные войны' },
  { type: 'video', video_url: 'videos/terminator.mp4', options: ['Терминатор', 'Робокоп', 'Матрица', 'Бегущий по лезвию'], correct_answer: 'Терминатор' },
  { type: 'video', video_url: 'videos/titanic.mp4', options: ['Титаник', 'Аватар', 'Интерстеллар', 'Гравитация'], correct_answer: 'Титаник' },
  
  { type: 'quote', text: 'Я буду тебя искать, я найду тебя и я убью тебя.', options: ['Убить Билла', 'Бесславные ублюдки', 'Джанго освобожденный', 'Однажды в Голливуде'], correct_answer: 'Убить Билла' },
  { type: 'quote', text: 'Жизнь похожа на коробку шоколадных конфет. Никогда не знаешь, что тебе попадется.', options: ['Форрест Гамп', 'Побег из Шоушенка', 'Зеленая миля', 'Список Шиндлера'], correct_answer: 'Форрест Гамп' },
  { type: 'quote', text: 'Моё имя — Бонди. Джеймс Бонди.', options: ['Джеймс Бонди', 'Миссия невыполнима', 'Борн', 'Джек Райан'], correct_answer: 'Джеймс Бонди' },
  { type: 'quote', text: 'Я король мира!', options: ['Титаник', 'Аватар', 'Терминатор', 'Чужие'], correct_answer: 'Титаник' },
  { type: 'quote', text: 'Может быть, это начало прекрасной дружбы.', options: ['Касабланка', 'Унесенные ветром', 'Гражданин Кейн', 'Волшебник страны Оз'], correct_answer: 'Касабланка' },
  { type: 'quote', text: 'Меня зовут Иньо Монтойя. Ты убил моего отца. Приготовься умереть.', options: ['Принцесса-невеста', 'Робин Гуд', 'Три мушкетера', 'Зорро'], correct_answer: 'Принцесса-невеста' },
  { type: 'quote', text: 'Я вижу мертвых людей.', options: ['Шестое чувство', 'Остров проклятых', 'Психо', 'Сияние'], correct_answer: 'Шестое чувство' },
  { type: 'quote', text: 'Хакуна матата!', options: ['Король Лев', 'Дамбо', 'Аладдин', 'Мулан'], correct_answer: 'Король Лев' },
  { type: 'quote', text: 'Покажи мне деньги!', options: ['Джерри Магуайер', 'Волк с Уолл-стрит', 'Большой шорт', 'Игра на понижение'], correct_answer: 'Джерри Магуайер' },
  { type: 'quote', text: 'Я люблю запах напалма по утрам.', options: ['Апокалипсис сегодня', 'Цельнометаллическая оболочка', 'Плутон', 'Взвод'], correct_answer: 'Апокалипсис сегодня' },
  { type: 'quote', text: 'Элементарно, Ватсон!', options: ['Шерлок Холмс', 'Агата Кристи', 'Эркюль Пуаро', 'Мисс Марпл'], correct_answer: 'Шерлок Холмс' },
  { type: 'quote', text: 'Я вернусь.', options: ['Терминатор', 'Робокоп', 'Матрица', 'Бегущий по лезвию'], correct_answer: 'Терминатор' },
  { type: 'quote', text: 'Могу я предложить вам красную таблетку или синюю таблетку?', options: ['Матрица', 'Терминатор', 'Бегущий по лезвию', 'Интерстеллар'], correct_answer: 'Матрица' },
  { type: 'quote', text: 'Власть развращает, абсолютная власть развращает абсолютно.', options: ['Властелин колец', 'Игра престолов', 'Гарри Поттер', 'Хроники Нарнии'], correct_answer: 'Властелин колец' }
]

import { storage } from '../services/storage'
import type { Question } from '../services/storage'

export function initializeQuestions(): Question[] {
  const existing = storage.getQuestions()
  if (existing.length === 0) {
    const questions: Question[] = initialQuestions.map((q, index) => ({
      ...q,
      id: index + 1
    }))
    storage.saveQuestions(questions)
    return questions
  }
  return existing
}

