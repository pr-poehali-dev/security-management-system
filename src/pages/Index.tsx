import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Заявка отправлена:', formData);
    alert('Заявка отправлена! Мы свяжемся с вами в течение 15 минут.');
    setFormData({ name: '', phone: '', address: '', message: '' });
  };

  const services = [
    {
      icon: 'Shield',
      title: 'Охрана объектов',
      description: 'Круглосуточная охрана жилых и коммерческих объектов с выездом ГБР в течение 5 минут'
    },
    {
      icon: 'Camera',
      title: 'Видеонаблюдение',
      description: 'Современные системы видеонаблюдения с удаленным доступом и записью'
    },
    {
      icon: 'Bell',
      title: 'Пожарная сигнализация',
      description: 'Системы пожарной безопасности с автоматическим вызовом пожарной службы'
    },
    {
      icon: 'Users',
      title: 'Физическая охрана',
      description: 'Профессиональные охранники для мероприятий и постоянной охраны'
    },
    {
      icon: 'Car',
      title: 'Мобильные патрули',
      description: 'Регулярные обходы территории и быстрое реагирование на тревожные сигналы'
    },
    {
      icon: 'Settings',
      title: 'Техническое обслуживание',
      description: 'Установка, настройка и регулярное обслуживание охранных систем'
    }
  ];

  const stats = [
    { number: '2000+', label: 'Охраняемых объектов' },
    { number: '24/7', label: 'Мониторинг' },
    { number: '5 мин', label: 'Время реагирования' },
    { number: '15 лет', label: 'Опыт работы' }
  ];

  const advantages = [
    {
      icon: 'Clock',
      title: 'Быстрое реагирование',
      description: 'Группа быстрого реагирования прибывает на объект в течение 5 минут'
    },
    {
      icon: 'Award',
      title: 'Лицензированная деятельность',
      description: 'Все необходимые лицензии и разрешения для охранной деятельности'
    },
    {
      icon: 'Phone',
      title: 'Круглосуточная поддержка',
      description: 'Пульт централизованного наблюдения работает 24 часа в сутки'
    },
    {
      icon: 'DollarSign',
      title: 'Доступные цены',
      description: 'Гибкая система тарифов и индивидуальный подход к каждому клиенту'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-['Inter']">
      {/* Header */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Shield" size={32} className="text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold">ГБР-БЕЗОПАСНОСТЬ</h1>
                <p className="text-sm text-slate-300">Профессиональная охрана 24/7</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Icon name="Phone" size={20} className="text-blue-400" />
                <span className="text-lg font-semibold">8 (800) 123-45-67</span>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Заказать звонок
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-blue-600 text-white mb-4">
                <Icon name="Zap" size={16} className="mr-2" />
                Быстрое реагирование за 5 минут
              </Badge>
              <h2 className="text-5xl font-bold mb-6 leading-tight">
                Надежная охрана вашего 
                <span className="text-blue-400"> имущества</span>
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Группа быстрого реагирования обеспечивает профессиональную охрану 
                жилых домов, квартир, дач и коммерческих объектов по всему городу
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Icon name="Shield" size={20} className="mr-2" />
                  Подключить охрану
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                  <Icon name="Play" size={20} className="mr-2" />
                  Узнать больше
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{stat.number}</div>
                    <div className="text-sm text-slate-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Icon name="Shield" size={24} className="mr-2 text-blue-400" />
                    Оставить заявку
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      placeholder="Ваше имя"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      required
                    />
                    <Input
                      type="tel"
                      placeholder="Номер телефона"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      required
                    />
                    <Input
                      placeholder="Адрес объекта"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      required
                    />
                    <Textarea
                      placeholder="Дополнительная информация"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      rows={3}
                    />
                    <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                      <Icon name="Send" size={20} className="mr-2" />
                      Получить консультацию
                    </Button>
                    <p className="text-xs text-slate-300 text-center">
                      Перезвоним в течение 15 минут и расскажем о тарифах
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 mb-4">
              Наши услуги
            </Badge>
            <h3 className="text-4xl font-bold text-gray-900 mb-6">
              Комплексные решения безопасности
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Предоставляем полный спектр охранных услуг для частных лиц и организаций
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Icon name={service.icon} size={24} className="text-blue-600" />
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-gray-900">{service.title}</h4>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 mb-4">
              Почему выбирают нас
            </Badge>
            <h3 className="text-4xl font-bold text-gray-900 mb-6">
              Преимущества ГБР-БЕЗОПАСНОСТЬ
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name={advantage.icon} size={32} className="text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold mb-3 text-gray-900">{advantage.title}</h4>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-6">
            Защитите свое имущество уже сегодня
          </h3>
          <p className="text-xl mb-8 text-blue-100">
            Получите персональную консультацию и расчет стоимости охранных услуг
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2 text-2xl font-bold">
              <Icon name="Phone" size={28} />
              <span>8 (800) 123-45-67</span>
            </div>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Заказать обратный звонок
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Icon name="Shield" size={28} className="text-blue-400" />
                <span className="text-xl font-bold">ГБР-БЕЗОПАСНОСТЬ</span>
              </div>
              <p className="text-slate-300 mb-4">
                Лидер в сфере охранных услуг. Надежность, профессионализм, быстрое реагирование.
              </p>
              <div className="flex space-x-2">
                <Icon name="MapPin" size={16} className="text-blue-400 mt-1" />
                <span className="text-slate-300">г. Москва, ул. Безопасности, д. 1</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Услуги</h4>
              <ul className="space-y-2 text-slate-300">
                <li>Охрана квартир</li>
                <li>Охрана домов</li>
                <li>Охрана дач</li>
                <li>Коммерческая охрана</li>
                <li>Видеонаблюдение</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-slate-300">
                <li>О нас</li>
                <li>Лицензии</li>
                <li>Тарифы</li>
                <li>Контакты</li>
                <li>Отзывы</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Контакты</h4>
              <div className="space-y-3 text-slate-300">
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={16} className="text-blue-400" />
                  <span>8 (800) 123-45-67</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={16} className="text-blue-400" />
                  <span>info@gbr-security.ru</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} className="text-blue-400" />
                  <span>Круглосуточно</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 ГБР-БЕЗОПАСНОСТЬ. Все права защищены. Лицензия на охранную деятельность.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;