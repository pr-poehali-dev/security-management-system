import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

interface SecuritySector {
  id: number;
  address: string;
  number: string;
  status: 'protected' | 'unprotected' | 'emergency' | 'alarm' | 'low_battery' | 'contract_terminated' | 'contract_suspended';
  batteryLevel: number;
  customStatus?: { name: string; color: string };
  history: Array<{
    timestamp: Date;
    action: string;
    type: 'protection' | 'emergency' | 'alarm' | 'battery' | 'contract';
  }>;
  contractStatus: 'active' | 'suspended' | 'terminated';
}

interface CustomStatus {
  id: string;
  name: string;
  color: string;
}

const Index = () => {
  const [sectors, setSectors] = useState<SecuritySector[]>([]);
  const [selectedSector, setSelectedSector] = useState<SecuritySector | null>(null);
  const [selectedSectors, setSelectedSectors] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('management');
  const [emergencyTime, setEmergencyTime] = useState<Date | null>(null);
  const [newSectorAddress, setNewSectorAddress] = useState('');
  const [newSectorNumber, setNewSectorNumber] = useState('');
  const [customStatuses, setCustomStatuses] = useState<CustomStatus[]>([]);
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusColor, setNewStatusColor] = useState('#3B82F6');

  // Инициализация 425 участков
  useEffect(() => {
    const initialSectors: SecuritySector[] = [];
    for (let i = 1; i <= 425; i++) {
      const batteryLevel = Math.floor(Math.random() * 100);
      let status: SecuritySector['status'] = Math.random() > 0.7 ? 'protected' : 'unprotected';
      
      // Устанавливаем статус разряженной батареи если уровень <= 20
      if (batteryLevel <= 20) {
        status = 'low_battery';
      }
      
      initialSectors.push({
        id: i,
        address: `ул. Охранная, д. ${i}`,
        number: `${String(i).padStart(3, '0')}`,
        status,
        batteryLevel,
        history: [],
        contractStatus: 'active'
      });
    }
    setSectors(initialSectors);
  }, []);

  // Постепенная разрядка батарей (каждые 5 минут)
  useEffect(() => {
    const interval = setInterval(() => {
      setSectors(prev => prev.map(sector => {
        if (sector.contractStatus !== 'active') return sector;
        
        const newBatteryLevel = Math.max(0, sector.batteryLevel - 1);
        let newStatus = sector.status;
        
        // Проверяем статус батареи
        if (newBatteryLevel <= 20 && sector.status !== 'emergency' && sector.status !== 'alarm') {
          newStatus = 'low_battery';
        } else if (newBatteryLevel > 20 && sector.status === 'low_battery') {
          newStatus = 'unprotected';
        }
        
        return {
          ...sector,
          batteryLevel: newBatteryLevel,
          status: newStatus
        };
      }));
    }, 300000); // 5 минут

    return () => clearInterval(interval);
  }, []);

  // Автоматическая сигнализация каждые 10 минут
  useEffect(() => {
    const interval = setInterval(() => {
      const randomSector = Math.floor(Math.random() * sectors.length);
      setSectors(prev => prev.map((sector, index) => {
        if (index === randomSector && sector.status === 'protected') {
          const updatedSector = {
            ...sector,
            status: 'alarm' as const,
            history: [...sector.history, {
              timestamp: new Date(),
              action: 'Срабатывание сигнализации',
              type: 'alarm' as const
            }]
          };
          return updatedSector;
        }
        return sector;
      }));
    }, 600000); // 10 минут

    return () => clearInterval(interval);
  }, [sectors.length]);

  const updateSectorStatus = (id: number, newStatus: SecuritySector['status']) => {
    setSectors(prev => prev.map(sector => {
      if (sector.id === id) {
        const action = newStatus === 'protected' ? 'Поставлен на охрану' : 
                     newStatus === 'unprotected' ? 'Снят с охраны' : 
                     newStatus === 'emergency' ? 'Экстренный вызов ГБР' : 'Сигнализация';
        return {
          ...sector,
          status: newStatus,
          history: [...sector.history, {
            timestamp: new Date(),
            action,
            type: newStatus === 'emergency' ? 'emergency' : 'protection' as const
          }]
        };
      }
      return sector;
    }));

    if (newStatus === 'emergency') {
      setEmergencyTime(new Date());
    }
  };

  const updateBattery = (id: number, charge: boolean) => {
    setSectors(prev => prev.map(sector => {
      if (sector.id === id) {
        const newLevel = charge ? 100 : 0;
        let newStatus = sector.status;
        
        // Обновляем статус в зависимости от уровня батареи
        if (charge && sector.status === 'low_battery') {
          newStatus = 'unprotected';
        } else if (!charge || newLevel <= 20) {
          newStatus = 'low_battery';
        }
        
        return {
          ...sector,
          batteryLevel: newLevel,
          status: newStatus,
          history: [...sector.history, {
            timestamp: new Date(),
            action: charge ? 'Батарея заряжена' : 'Батарея разряжена',
            type: 'battery' as const
          }]
        };
      }
      return sector;
    }));
  };

  const getStatusColor = (status: SecuritySector['status']) => {
    switch (status) {
      case 'protected': return 'bg-green-500';
      case 'unprotected': return 'bg-blue-500';
      case 'emergency': return 'bg-red-500';
      case 'alarm': return 'bg-orange-500';
      case 'low_battery': return 'bg-orange-400';
      case 'contract_terminated': return 'bg-gray-600';
      case 'contract_suspended': return 'bg-yellow-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: SecuritySector['status']) => {
    switch (status) {
      case 'protected': return 'На охране';
      case 'unprotected': return 'Не на охране';
      case 'emergency': return 'ВЫЕЗД ГБР';
      case 'alarm': return 'СИГНАЛИЗАЦИЯ';
      case 'low_battery': return 'РАЗРЯЖЕНО';
      case 'contract_terminated': return 'РАСТОРГНУТ';
      case 'contract_suspended': return 'ПРИОСТАНОВЛЕН';
      default: return 'Неизвестно';
    }
  };

  const protectedCount = sectors.filter(s => s.status === 'protected').length;
  const emergencyCount = sectors.filter(s => s.status === 'emergency').length;
  const alarmCount = sectors.filter(s => s.status === 'alarm').length;
  const lowBatteryCount = sectors.filter(s => s.status === 'low_battery').length;
  const contractIssuesCount = sectors.filter(s => s.status === 'contract_terminated' || s.status === 'contract_suspended').length;

  const addNewSector = () => {
    if (newSectorAddress && newSectorNumber) {
      const newSector: SecuritySector = {
        id: Math.max(...sectors.map(s => s.id), 0) + 1,
        address: newSectorAddress,
        number: newSectorNumber,
        status: 'unprotected',
        batteryLevel: 100,
        history: [{
          timestamp: new Date(),
          action: 'Участок создан',
          type: 'protection'
        }],
        contractStatus: 'active'
      };
      setSectors(prev => [...prev, newSector]);
      setNewSectorAddress('');
      setNewSectorNumber('');
    }
  };

  const addCustomStatus = () => {
    if (newStatusName && newStatusColor) {
      const newStatus: CustomStatus = {
        id: Date.now().toString(),
        name: newStatusName,
        color: newStatusColor
      };
      setCustomStatuses(prev => [...prev, newStatus]);
      setNewStatusName('');
      setNewStatusColor('#3B82F6');
    }
  };

  const updateContractStatus = (id: number, newContractStatus: SecuritySector['contractStatus']) => {
    setSectors(prev => prev.map(sector => {
      if (sector.id === id) {
        let newStatus: SecuritySector['status'] = sector.status;
        let action = '';
        
        switch (newContractStatus) {
          case 'suspended':
            newStatus = 'contract_suspended';
            action = 'Договор приостановлен';
            break;
          case 'terminated':
            newStatus = 'contract_terminated';
            action = 'Договор расторгнут';
            break;
          case 'active':
            newStatus = 'unprotected';
            action = 'Договор возобновлен';
            break;
        }
        
        return {
          ...sector,
          status: newStatus,
          contractStatus: newContractStatus,
          history: [...sector.history, {
            timestamp: new Date(),
            action,
            type: 'contract' as const
          }]
        };
      }
      return sector;
    }));
  };

  const setCustomStatus = (sectorId: number, customStatus: CustomStatus) => {
    setSectors(prev => prev.map(sector => {
      if (sector.id === sectorId) {
        return {
          ...sector,
          customStatus,
          history: [...sector.history, {
            timestamp: new Date(),
            action: `Установлен кастомный статус: ${customStatus.name}`,
            type: 'protection' as const
          }]
        };
      }
      return sector;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Roboto']">
      {/* Заголовок */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Shield" size={32} className="text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Система ГБР</h1>
                <p className="text-sm text-gray-600">Управление охранными участками</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Icon name="Shield" size={16} className="mr-1" />
                На охране: {protectedCount}
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700">
                <Icon name="AlertTriangle" size={16} className="mr-1" />
                Тревог: {alarmCount}
              </Badge>
              {emergencyTime && (
                <Badge variant="destructive">
                  <Icon name="Siren" size={16} className="mr-1" />
                  Экстренных: {emergencyCount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="home">Главная</TabsTrigger>
            <TabsTrigger value="management">Управление</TabsTrigger>
            <TabsTrigger value="monitoring">Мониторинг</TabsTrigger>
            <TabsTrigger value="alarm">Сигнализация</TabsTrigger>
            <TabsTrigger value="reports">Отчеты</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          {/* Главная страница */}
          <TabsContent value="home" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Всего участков</CardTitle>
                  <Icon name="Building2" className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sectors.length}</div>
                  <p className="text-xs text-muted-foreground">охранных участков</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">На охране</CardTitle>
                  <Icon name="ShieldCheck" className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{protectedCount}</div>
                  <p className="text-xs text-muted-foreground">активных участков</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Тревоги</CardTitle>
                  <Icon name="AlertTriangle" className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{alarmCount}</div>
                  <p className="text-xs text-muted-foreground">срабатываний</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Разряжено</CardTitle>
                  <Icon name="BatteryLow" className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-400">{lowBatteryCount}</div>
                  <p className="text-xs text-muted-foreground">низкий заряд</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Экстренные</CardTitle>
                  <Icon name="Siren" className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{emergencyCount}</div>
                  <p className="text-xs text-muted-foreground">вызовов ГБР</p>
                </CardContent>
              </Card>
            </div>

            {emergencyTime && (
              <Alert className="border-red-200 bg-red-50">
                <Icon name="Siren" className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Последний экстренный вызов: {emergencyTime.toLocaleTimeString()}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Управление участками */}
          <TabsContent value="management">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Управление охранными участками</h3>
                <div className="text-sm text-gray-600">
                  Всего участков: {sectors.length}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {sectors
                  .sort((a, b) => {
                    if (a.status === 'emergency' && b.status !== 'emergency') return -1;
                    if (a.status !== 'emergency' && b.status === 'emergency') return 1;
                    if (a.status === 'low_battery' && b.status !== 'low_battery') return -1;
                    if (a.status !== 'low_battery' && b.status === 'low_battery') return 1;
                    if (a.status === 'alarm' && b.status !== 'alarm') return -1;
                    if (a.status !== 'alarm' && b.status === 'alarm') return 1;
                    return a.id - b.id;
                  })
                  .map(sector => (
                  <Card 
                    key={sector.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      sector.status === 'emergency' ? 'border-red-500 shadow-red-100' : 
                      sector.status === 'low_battery' ? 'border-orange-400 shadow-orange-100' : ''
                    }`}
                    onClick={() => setSelectedSector(sector)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">#{sector.number}</span>
                        <Badge className={`${getStatusColor(sector.status)} text-white`}>
                          {getStatusText(sector.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{sector.address}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Icon name="Battery" size={16} />
                          <span className="text-xs">{sector.batteryLevel}%</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant={sector.status === 'protected' ? 'destructive' : 'default'}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateSectorStatus(sector.id, sector.status === 'protected' ? 'unprotected' : 'protected');
                            }}
                          >
                            {sector.status === 'protected' ? 'Снять' : 'Поставить'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateSectorStatus(sector.id, 'emergency');
                            }}
                          >
                            ГБР
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Мониторинг */}
          <TabsContent value="monitoring">
            <Card>
              <CardHeader>
                <CardTitle>Мониторинг системы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Статистика вызовов ГБР</h4>
                    {emergencyTime && (
                      <p className="text-sm">Время последнего вызова: {emergencyTime.toLocaleString()}</p>
                    )}
                    <p className="text-sm">Активных вызовов: {emergencyCount}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Состояние системы</h4>
                    <p className="text-sm">Участков на охране: {protectedCount}</p>
                    <p className="text-sm">Сработавших сигнализаций: {alarmCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Сигнализация */}
          <TabsContent value="alarm">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Управление сигнализацией</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedSectors.length === sectors.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSectors(sectors.map(s => s.id));
                            } else {
                              setSelectedSectors([]);
                            }
                          }}
                        />
                        <span className="text-sm font-medium">Выбрать всё</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        Выбрано: {selectedSectors.length} из {sectors.length}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-64 overflow-y-auto mb-4">
                    {sectors.map(sector => (
                      <div key={sector.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedSectors.includes(sector.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSectors(prev => [...prev, sector.id]);
                            } else {
                              setSelectedSectors(prev => prev.filter(id => id !== sector.id));
                            }
                          }}
                        />
                        <span className="text-sm">#{sector.number}</span>
                        <Badge size="sm" className={`${getStatusColor(sector.status)} text-white`}>
                          {getStatusText(sector.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        selectedSectors.forEach(id => updateSectorStatus(id, 'emergency'));
                        setSelectedSectors([]);
                      }}
                      variant="destructive"
                      disabled={selectedSectors.length === 0}
                    >
                      ВЫЕЗД ГБР
                    </Button>
                    <Button
                      onClick={() => {
                        selectedSectors.forEach(id => updateSectorStatus(id, 'protected'));
                        setSelectedSectors([]);
                      }}
                      disabled={selectedSectors.length === 0}
                    >
                      Поставить на охрану
                    </Button>
                    <Button
                      onClick={() => {
                        selectedSectors.forEach(id => updateSectorStatus(id, 'unprotected'));
                        setSelectedSectors([]);
                      }}
                      variant="outline"
                      disabled={selectedSectors.length === 0}
                    >
                      Снять с охраны
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Отчеты */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Отчеты и история</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {sectors.map(sector => (
                    <Card key={sector.id} className="cursor-pointer hover:shadow-md" onClick={() => setSelectedSector(sector)}>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">#{sector.number}</span>
                          <Badge size="sm">История: {sector.history.length}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{sector.address}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Настройки */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Создание нового участка</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Адрес</label>
                    <Input
                      value={newSectorAddress}
                      onChange={(e) => setNewSectorAddress(e.target.value)}
                      placeholder="Введите адрес участка"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Номер участка</label>
                    <Input
                      value={newSectorNumber}
                      onChange={(e) => setNewSectorNumber(e.target.value)}
                      placeholder="Введите номер участка"
                    />
                  </div>
                  <Button onClick={addNewSector}>Создать участок</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Кастомные статусы</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-end space-x-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Название статуса</label>
                      <Input
                        value={newStatusName}
                        onChange={(e) => setNewStatusName(e.target.value)}
                        placeholder="Например: На обслуживании"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Цвет</label>
                      <Input
                        type="color"
                        value={newStatusColor}
                        onChange={(e) => setNewStatusColor(e.target.value)}
                        className="w-16 h-9"
                      />
                    </div>
                    <Button onClick={addCustomStatus}>Добавить</Button>
                  </div>
                  
                  {customStatuses.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Созданные статусы:</h4>
                      <div className="flex flex-wrap gap-2">
                        {customStatuses.map(status => (
                          <Badge 
                            key={status.id} 
                            style={{ backgroundColor: status.color }}
                            className="text-white"
                          >
                            {status.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Управление договорами</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                    {sectors.map(sector => (
                      <Card key={sector.id}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">#{sector.number}</span>
                            <Badge variant={sector.contractStatus === 'active' ? 'default' : 'secondary'}>
                              {sector.contractStatus === 'active' ? 'Активный' : 
                               sector.contractStatus === 'suspended' ? 'Приостановлен' : 'Расторгнут'}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{sector.address}</p>
                          <div className="flex flex-wrap gap-1">
                            {sector.contractStatus === 'active' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateContractStatus(sector.id, 'suspended')}
                                >
                                  Приостановить
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => updateContractStatus(sector.id, 'terminated')}
                                >
                                  Расторгнуть
                                </Button>
                              </>
                            )}
                            {sector.contractStatus !== 'active' && (
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => updateContractStatus(sector.id, 'active')}
                              >
                                Возобновить
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Диалог управления участком */}
        {selectedSector && (
          <Dialog open={!!selectedSector} onOpenChange={() => setSelectedSector(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Участок #{selectedSector.number}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p><strong>Адрес:</strong> {selectedSector.address}</p>
                <div className="flex items-center space-x-2">
                  <span><strong>Статус:</strong></span>
                  <Badge className={`${getStatusColor(selectedSector.status)} text-white`}>
                    {getStatusText(selectedSector.status)}
                  </Badge>
                </div>
                <p><strong>Заряд батареи:</strong> {selectedSector.batteryLevel}%</p>
                
                <div className="flex space-x-2">
                  <Button
                    variant={selectedSector.status === 'protected' ? 'destructive' : 'default'}
                    onClick={() => {
                      updateSectorStatus(selectedSector.id, selectedSector.status === 'protected' ? 'unprotected' : 'protected');
                      setSelectedSector({...selectedSector, status: selectedSector.status === 'protected' ? 'unprotected' : 'protected'});
                    }}
                  >
                    {selectedSector.status === 'protected' ? 'Снять с охраны' : 'Поставить на охрану'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      updateSectorStatus(selectedSector.id, 'emergency');
                      setSelectedSector({...selectedSector, status: 'emergency'});
                    }}
                  >
                    Экстренный вызов ГБР
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => updateBattery(selectedSector.id, false)}
                  >
                    Разрядить батарею
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => updateBattery(selectedSector.id, true)}
                  >
                    Зарядить батарею
                  </Button>
                  <Button
                    variant={selectedSector.batteryLevel >= 90 ? 'default' : 'outline'}
                    disabled={selectedSector.batteryLevel < 90}
                  >
                    Батарея заряжена
                  </Button>
                </div>

                {customStatuses.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Кастомные статусы:</h4>
                    <div className="flex flex-wrap gap-2">
                      {customStatuses.map(status => (
                        <Button
                          key={status.id}
                          size="sm"
                          variant="outline"
                          onClick={() => setCustomStatus(selectedSector.id, status)}
                          style={{ borderColor: status.color, color: status.color }}
                        >
                          {status.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSector.customStatus && (
                  <div className="flex items-center space-x-2">
                    <span><strong>Кастомный статус:</strong></span>
                    <Badge 
                      style={{ backgroundColor: selectedSector.customStatus.color }}
                      className="text-white"
                    >
                      {selectedSector.customStatus.name}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSectors(prev => prev.map(sector => 
                          sector.id === selectedSector.id 
                            ? { ...sector, customStatus: undefined }
                            : sector
                        ));
                        setSelectedSector({ ...selectedSector, customStatus: undefined });
                      }}
                    >
                      Удалить
                    </Button>
                  </div>
                )}

                {selectedSector.history.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">История участка:</h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {selectedSector.history.slice(-5).reverse().map((event, index) => (
                        <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                          <span className="font-medium">{event.timestamp.toLocaleString()}</span>
                          <br />
                          {event.action}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Index;