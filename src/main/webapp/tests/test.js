/**
 * Created by kascode on 30.11.15.
 */

var expect = chai.expect;
var should = chai.should();

describe('Localization scripts', function () {
  it('Should change current language', function () {
    locale.setLanguage('ru-RU');
    expect(locale.currentLang).to.equal('ru-RU');
  });

  it('Should return localized string from basic phrase', function () {
    var str = locale.localize('ap1');
    expect(str).to.equal("Мобильная версия");
  });

  it('Should return localized string from deep linked phrase (prop.prop1)', function () {
    var str = locale.localize('ui.goto');
    expect(str).to.equal("Перейти");
  });
});
